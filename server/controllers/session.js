import Session from '../models/session.js';
import School from "../models/School.js";
import Faculty from "../models/Faculty.js";
import Class from "../models/Class.js";
import Course from "../models/Course.js";
import Student from "../models/Student.js";

import Event from "../models/Event.js";
import Query from "../models/Query.js";
import Timetable from "../models/Timetable.js";
import Task from "../models/Task.js";
import Test from "../models/Test.js";
import Attendance from "../models/Attendance.js";
import { catchAsync } from '../utils/catchAsync.js';

const getSessionName = () => {
  const currentYear = new Date().getFullYear();
  return `${currentYear}-${currentYear + 1}`;
};

export const getActiveSession = async (user) => {
  const schoolID = user.schoolID;
  if (!schoolID) {
    throw new Error('School ID is required');
  }
  const activeSession = await Session.findOne({ schoolID, isActive: true })
    .populate('name');
  
  return activeSession;
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

    // find the current active session
    const activeSession = await Session.findOne({ schoolID, isActive: true });

    // Prepare session name and new session instance
    const sessionName = getSessionName();
    const newSession = new Session({
      name: sessionName,
      schoolID,
      isActive: true,
    });

    // if an active session exists, set it to inactive and save both sessions
    const sessionOps = [];

    if (activeSession) {
      activeSession.isActive = false;
      sessionOps.push(activeSession.save());
    }

    sessionOps.push(newSession.save());

    // clear interconnections
    const clearOps = [
        // clear faculty associations
        Faculty.updateMany(
        { schoolID },
        { $set: { subjectsTaught: [], classesTaught: [] } }
        ),
        // clear class associations
        Class.updateMany(
        { schoolID },
        { $set: { teachers: [] } }
        ),
        // clear course associations
        Course.updateMany(
        { schoolID },
        { $set: { teacher: null } }
        ),
    ];

    // Run saves and clears in parallel
    const [, savedNewSession] = await Promise.all([
        ...sessionOps,
        ...clearOps,
    ]);

    updateClass(schoolID)

    // Update all students to point to the new session
    const studentUpdate = Student.updateMany(
        { schoolID },
        {
        $set: { sessionID: savedNewSession._id },
        }
    );

    // delete all documents related to the old session
    const deleteOldSessionData = activeSession
    ? Promise.all([
        Event.deleteMany({ sessionID: activeSession._id }),
        Query.deleteMany({ sessionID: activeSession._id }),
        Timetable.deleteMany({ sessionID: activeSession._id }),
        Task.deleteMany({ sessionID: activeSession._id }),
        Test.deleteMany({ sessionID: activeSession._id }),
        Attendance.deleteMany({ sessionID: activeSession._id }),
      ])
    : [];

    // Push session to school
    const updateSchoolSession = School.findByIdAndUpdate(schoolID, {
        $push: { sessions: savedNewSession._id },
    });

    // Execute all operations in parallel
    await Promise.all([
        studentUpdate,
        deleteOldSessionData,
        updateSchoolSession,
    ]);

    res.status(201).json({
      message: "New session created successfully.",
      session: savedNewSession,
    });
});