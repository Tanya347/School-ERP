import Session from '../models/session.js';
import School from "../models/School.js";
import Faculty from "../models/Faculty.js";
import Class from "../models/Class.js";
import Course from "../models/Course.js";
import Student from "../models/Student.js";
import Event from "../models/Event.js";
import Timetable from "../models/Timetable.js";
import Task from "../models/Task.js";
import Test from "../models/Test.js";
import Attendance from "../models/Attendance.js";

import { catchAsync } from '../utils/catchAsync.js';
import { successMsg } from "../utils/constants.js";

const getSessionMeta = () => {
  const startYear = new Date().getFullYear();
  const endYear = startYear + 1;
  return {
    name: `${startYear}-${endYear}`,
    startYear,
    endYear,
  };
};


export const getActiveSession = async (user) => {
  const schoolID = user.schoolID;
  if (!schoolID) {
    throw new Error('School ID is required');
  }
  return await Session.findOne({ schoolID, isActive: true })
    .select('name startYear endYear isActive');
};

const updateClass = async (schoolID) => {
  const classes = await Class.find({ schoolID });
  
  const classMap = new Map();
  classes.forEach(cls => classMap.set(cls.classNumber, cls._id));

  const students = await Student.find({ schoolID }).populate('class');

  // Array to store bulk update operations
  const studentUpdates = [];
  const classStudentMap = new Map();

  students.forEach(student => {
    const currentClass = student.class;
    if (!currentClass) return; // Skip students not assigned to a class

    const nextClassNumber = currentClass.classNumber + 1;

    // If nextClassNumber is 13, mark student as passed out and remove from class
    if (nextClassNumber === 13) {
      studentUpdates.push({
      updateOne: {
        filter: { _id: student._id },
        update: {
        $set: {
          passedOut: true,
          class: null,
        }
        }
      }
      });
      return; // Skip further processing for this student
    }
    const nextClassId = classMap.get(nextClassNumber);
    if(!nextClassId) return;

    if (nextClassId) {
      // Prepare the student update
      studentUpdates.push({
        updateOne: {
          filter: { _id: student._id },
          update: {
            $set: {
              class: nextClassId,
            }
          }
        }
      });

      // Build the list of students per class for class.students[] update
      if (!classStudentMap.has(nextClassId)) {
        classStudentMap.set(nextClassId, []);
      }
      classStudentMap.get(nextClassId).push(student._id);
    }
  });

  // Bulk update students
  if (studentUpdates.length > 0) {
    await Student.bulkWrite(studentUpdates);
  }

  await Class.updateMany(
    { schoolID },
    { $set: { students: [] } },
  );

  // Clear existing class.student arrays and repopulate with promoted students
  const classUpdateOps = [];
  for (const [classId, studentIds] of classStudentMap.entries()) {
    classUpdateOps.push(
      Class.findByIdAndUpdate(classId, { $set: { students: studentIds } })
    );
  }

  await Promise.all(classUpdateOps);

}

export const createSession = catchAsync(async (req, res, next) => {
    
    const schoolID = req.user.schoolID;

    if (!schoolID) {
        return next(new AppError('School ID is required', 400));
    }

    const mongoSession = await mongoose.startSession();
    mongoSession.startTransaction();

    try {

      // find the current active session
      const activeSession = await Session.findOne({ schoolID, isActive: true }).session(mongoSession);

      // Deactivate old session FIRST
      if (activeSession) {
        await Session.updateOne(
          { _id: activeSession._id },
          { isActive: false },
          { session: mongoSession }
        );
      }

      // Prepare session name and new session instance
      const { name, startYear, endYear } = getSessionMeta();
      const [newSession] = await Session.create(
        [{
          name,
          startYear,
          endYear,
          schoolID,
          isActive: true,
        }],
        { session: mongoSession }
      );

      // Clear interconnections
      await Promise.all([
        Faculty.updateMany(
          { schoolID },
          { $set: { subjectsTaught: [], classesTaught: [], classTeacherTo: null } },
          { session: mongoSession }
        ),
        Class.updateMany(
          { schoolID },
          { $set: { teachers: [], classTeacher: null } },
          { session: mongoSession }
        ),
        Course.updateMany(
          { schoolID },
          {
            $set: {
              'examStatus.status': 'pending',
              'examStatus.examDate': null,
              teacher: null,
            },
          },
          { session: mongoSession }
        ),
      ]);

      // Promote students & update classes
      await updateClass(schoolID)

      // Update students' session
      await Student.updateMany(
        { schoolID, passedOut: false },
        { $set: { sessionID: newSession._id } },
        { session: mongoSession }
      );

      // Delete old session data
      if (activeSession) {
          await Promise.all([
          Event.deleteMany({ sessionID: activeSession._id }, { session: mongoSession }),
          Timetable.deleteMany({ sessionID: activeSession._id }, { session: mongoSession }),
          Task.deleteMany({ sessionID: activeSession._id }, { session: mongoSession }),
          Test.deleteMany({ sessionID: activeSession._id }, { session: mongoSession }),
          Attendance.deleteMany({ sessionID: activeSession._id }, { session: mongoSession }),
        ]);
      }

      // Push session to school
      await School.findByIdAndUpdate(
        schoolID,
        { $push: { sessions: newSession._id } },
        { session: mongoSession }
      );

      await mongoSession.commitTransaction();
      mongoSession.endSession();

      res.status(201).json({
        status: successMsg,
        message: "New academic session created successfully",
        session: newSession,
      });

    }
    catch(error) {
      await mongoSession.abortTransaction();
      mongoSession.endSession();
      throw err;
    }
});

export const getSession = catchAsync(async (req, res, next) => {
  const schoolID = req.params.schoolId
  const session = await Session.find({schoolID: schoolID, isActive: true})
  res.status(200).json({
    status: successMsg,
    data: session[0]
  })
})