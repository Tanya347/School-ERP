import Session from '../models/Session.js';
import Faculty from "../models/Faculty.js";
import Class from "../models/Class.js";
import Course from "../models/Course.js";
import Student from "../models/Student.js";
import Event from "../models/Event.js";
import TimetableSlot from "../models/Timetable.js";
import Task from "../models/Task.js";
import Test from "../models/Test.js";
import Attendance from "../models/Attendance.js";
import Material from "../models/Material.js";

import { catchAsync } from '../utils/catchAsync.js';
import { successMsg } from "../utils/constants.js";
import { AppError } from "../utils/customError.js";

import mongoose from 'mongoose';
import { deleteFile } from '../utils/imageHandler.js';

// Generate session metadata
// -----------------------------------------------
export const getSessionMeta = () => {
  const startYear = new Date().getFullYear();
  const endYear = startYear + 1;
  return {
    name: `${startYear}-${endYear}`,
    startYear,
    endYear,
  };
};


// Get active session
// -----------------------------------------------
export const getActiveSession = async (user) => {
  const schoolID = user.schoolID;
  if (!schoolID) {
    throw new Error('School ID is required');
  }
  return await Session.findOne({ schoolID, isActive: true })
    .select('name startYear endYear isActive');
};


// Helper to deactivate the current active session
const deactivateCurrentSession = async (schoolID, session) => {
  const activeSession = await Session.findOne({ schoolID, isActive: true }).session(session);
  if (activeSession) {
    await Session.updateOne(
      { _id: activeSession._id },
      { isActive: false },
      { session }
    );
  }
  return activeSession;
};

// Helper to create a new active session
const createNewSessionInstance = async (schoolID, session) => {
  const { name, startYear, endYear } = getSessionMeta();
  const newSession = await Session.create([{
    name,
    startYear,
    endYear,
    schoolID,
    isActive: true,
  }], { session });
  return newSession[0];
};

// Helper to reset session-specific interconnections
const resetInterconnections = async (schoolID, session) => {
  await Promise.all([
    Faculty.updateMany(
      { schoolID },
      { $set: { classTeacherTo: null } },
      { session }
    ),
    Class.updateMany(
      { schoolID },
      { $set: { classTeacher: null } },
      { session }
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
      { session }
    ),
  ]);
};

// Helper to cleanup data from the old session
const cleanupOldSessionData = async (activeSession, session) => {
  if (!activeSession) return;

  // Delete images of events in the old session
  const eventsToDelete = await Event.find({ sessionID: activeSession._id });
  for (const event of eventsToDelete) {
    if (event.cloud_id) {
      await deleteFile(event.cloud_id);
    }
  }

  await Promise.all([
    Event.deleteMany({ sessionID: activeSession._id }, { session }),
    TimetableSlot.deleteMany({ sessionID: activeSession._id }, { session }),
    Task.deleteMany({ sessionID: activeSession._id }, { session }),
    Test.deleteMany({ sessionID: activeSession._id }, { session }),
    Attendance.deleteMany({ sessionID: activeSession._id }, { session }),
    Material.deleteMany({ sessionID: activeSession._id }, { session }),
    Update.deleteMany({ sessionID: activeSession._id }, { session }),
  ]);
};

// Update classes and promote students
// -----------------------------------------------
const updateClass = async (schoolID, session) => {
  const classes = await Class.find({ schoolID }).session(session);
  
  const classMap = new Map();
  classes.forEach(cls => classMap.set(cls.classNumber, cls._id));

  const students = await Student.find({ schoolID }).populate('classID').session(session);

  // Array to store bulk update operations
  const studentUpdates = [];
  const classStudentMap = new Map();

  students.forEach(student => {
    const currentClass = student.classID;
    if (!currentClass) return; // Skip students not assigned to a class

    const nextClassNumber = currentClass.classNumber + 1;

    const nextClassId = classMap.get(nextClassNumber);
    if(!nextClassId) {
      studentUpdates.push({
        updateOne: {
          filter: { _id: student._id },
          update: {
          $set: {
            passedOut: true,
            classID: null,
          }
          }
        }
      });
      return; // Skip further processing for this student
    }

    if (nextClassId) {
      // Prepare the student update
      studentUpdates.push({
        updateOne: {
          filter: { _id: student._id },
          update: {
            $set: {
              classID: nextClassId,
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
    await Student.bulkWrite(studentUpdates, { session });
  }

  await Class.updateMany(
    { schoolID },
    { $set: { students: [] } },
    { session }
  );

  // Clear existing class.student arrays and repopulate with promoted students
  const classUpdateOps = [];
  for (const [classId, studentIds] of classStudentMap.entries()) {
    classUpdateOps.push(
      Class.findByIdAndUpdate(classId, { $set: { students: studentIds } }, { session })
    );
  }

  await Promise.all(classUpdateOps);

}

// Create a new academic session
// -----------------------------------------------
export const createSession = catchAsync(async (req, res, next) => {
    const schoolID = req.user.schoolID;
    if (!schoolID) return next(new AppError('School ID is required', 400));

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const activeSession = await deactivateCurrentSession(schoolID, session);
      const newSession = await createNewSessionInstance(schoolID, session);

      await resetInterconnections(schoolID, session);
      await updateClass(schoolID, session);

      await Student.updateMany(
        { schoolID, passedOut: false },
        { $set: { sessionID: newSession._id } },
        { session }
      );

      await cleanupOldSessionData(activeSession, session);

      await session.commitTransaction();
      res.status(201).json({
        status: successMsg,
        message: "New academic session created successfully",
        session: newSession,
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
});

// Get session by school ID
// -----------------------------------------------
export const getSession = catchAsync(async (req, res, next) => {
  const schoolID = req.params.schoolId
  const session = await Session.find({schoolID: schoolID, isActive: true})
  res.status(200).json({
    status: successMsg,
    data: session[0]
  })
})