import Student from "../models/Student.js"
import Marks from "../models/Marks.js";

import { catchAsync } from "../utils/catchAsync.js";
import { successMsg } from "../utils/constants.js";
import { AppError } from "../utils/customError.js";
import Course from "../models/Course.js";


// Enter or update marks for a subject
// -----------------------------------------------
export const enterMarksForSubject = catchAsync(async (req, res) => {
  const { subjectId } = req.params;
  const { marksData } = req.body;
  const { schoolID  } = req.user;

  const activeSession = await getActiveSession(req.user);
  const sessionID = activeSession._id;
  
  for (const data of marksData) {

    const { studentId, marks } = data;

    const course = await Course.findOne({
      _id: subjectId,
      schoolID
    });
  
    const student = await Student.findOne({
      _id: studentId,
      classID: course.classID,
      schoolID
    });
  
    if (!student) throw new AppError("Invalid student for this subject", 400);

    await Marks.findOneAndUpdate(
      {
        student: studentId,
        course: subjectId,
        sessionID,
        schoolID,
      },
      {
        student: studentId,
        course: subjectId,
        sessionID,
        schoolID,
        marksObtained: marks,
        status: "evaluated",
      },
      { upsert: true, new: true }
    );
  }

  res.status(200).json({
    status: successMsg,
    message: "Marks entered successfully for all students",
  });
});


// Get marks of a student
// -----------------------------------------------
export const getMarksOfStudent = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const { sessionID } = req.user;

  const student = await Student.findById(studentId).populate("classID");
  if (!student) {
    return next(new AppError('Student not found', 404));
  }

  const courses = await Course.find({
    classID: student.classID,
    schoolID: req.user.schoolID
  }).select("name");

  const marks = await Marks.find({
    student: studentId,
    sessionID,
    schoolID: req.user.schoolID
  });


  const marksMap = {};
  marks.forEach(m => marksMap[m.course.toString()] = m.marksObtained);

  const marksData = courses.map(c => ({
    subjectId: c._id,
    subjectName: c.name,
    marks: marksMap[c._id.toString()] ?? null
  }));

  const allMarksPresent = marksData.every(m => m.marks !== null);

  res.status(200).json({
    status: successMsg,
    data: { marksData, allMarksPresent },
  });
});


// Get marks of a subject for all students in that subject's class
// -----------------------------------------------
export const getMarksOfSubject = catchAsync(async (req, res) => {
  const { subjectId } = req.params;
  const { sessionID } = req.user;

  const marks = await Marks.find({
    course: subjectId,
    sessionID,
    schoolID: req.user.schoolID,
  })
  .populate("student", "name enroll");

  const result = marks.map(m => ({
    _id: m.student._id,
    studentName: m.student.name,
    enrollment: m.student.enroll,
    marks: m.marksObtained,
  }));

  res.status(200).json({
    status: successMsg,
    data: result,
  });
});


// Get marks of all students in a class across all subjects
// -----------------------------------------------
export const getMarksOfClass = catchAsync(async (req, res) => {
  const { classId } = req.params;
  const { sessionID } = req.user;

  const students = await Student.find({ 
    classID: classId,
    schoolID: req.user.schoolID 
  }).select("name enroll");

  const courses = await Course.find({
    classID: classId,
    schoolID: req.user.schoolID
  }).select("_id name");

  const marks = await Marks.find({
    sessionID,
    schoolID: req.user.schoolID,
    course: { $in: courses.map(c => c._id) }
  })
  .populate("course", "name")
  .populate("student", "_id");

  // Filter marks for only the current class
  const classMarks = marks.filter(m => m.course.classID?.toString() === classId);
  const subjectSet = new Set(classMarks.map(m => m.course.name));

  const studentMap = {};
  students.forEach(s => {
    studentMap[s._id] = {
      _id: s._id,
      studentName: s.name,
      enrollment: s.enroll,
    };
    subjectSet.forEach(sub => (studentMap[s._id][sub] = null));
  });

  classMarks.forEach(m => {
    if (studentMap[m.student._id]) {
      studentMap[m.student._id][m.course.name] = m.marksObtained;
    }
  });

  res.status(200).json({
    status: successMsg,
    data: Object.values(studentMap),
  });
});


// Clear marks for a subject
// -----------------------------------------------
export const clearMarksForSubject = catchAsync(async (req, res) => {
  const { subjectId } = req.params;
  const { sessionID } = req.user;

  await Marks.deleteMany({
    course: subjectId,
    sessionID,
    schoolID: req.user.schoolID,
  });

  res.status(200).json({
    status: successMsg,
    message: "Marks cleared for the specified subject",
  });
});


// Clear marks for all subjects in a class
// -----------------------------------------------
export const clearMarksForClass = catchAsync(async (req, res) => {
  const { classId } = req.params;
  const { sessionID } = req.user;

  const students = await Student.find({ classID: classId, schoolID: req.user.schoolID }).select("_id");

  await Marks.deleteMany({
    student: { $in: students.map(s => s._id) },
    sessionID,
    schoolID: req.user.schoolID
  });

  res.status(200).json({
    status: successMsg,
    message: "All marks cleared for the specified class",
  });
});


// Get student's marks history across sessions
// -----------------------------------------------
export const getStudentMarksHistory = catchAsync(async (req, res, next) => {

  const { studentId } = req.params;
  const schoolId = req.user.schoolID;

  const student = await Student.findById(studentId).select("name enroll");

  if(!student) {
    return next(new AppError('Student not found', 404));
  }

  const marks = await Marks.find({
    student: studentId,
    schoolID: schoolId,
  })
    .populate({
      path: "course",
      select: "name classID",
      populate: {
        path: "classID",
        select: "name"
      }
    })
    .populate({
      path: "sessionID",
      select: "name startYear endYear",
    })
    .sort({ "sessionID.startYear": 1});

  const historyMap = {};

  marks.forEach(mark => {
    const sessionId = mark.sessionID._id.toString();

    if(!historyMap[sessionId]) {
      historyMap[sessionId] = {
        sessionId,
        sessionName: mark.sessionID.name,
        className: mark.course.classID?.name || "N/A",
        subjects: []
      };
    }

    historyMap[sessionId].subjects.push({
      subjectId: mark.course._id,
      subjectName: mark.course.name,
      marks: mark.marksObtained,
      status: mark.status
    });
  });

  res.status(200).json({
    status: successMsg,
    data: {
      student: {
        _id: student._id,
        name: student.name,
        enrollment: student.enroll,
      },
      history: Object.values(historyMap),
    },
  });
})
