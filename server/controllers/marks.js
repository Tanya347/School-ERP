import Student from "../models/Student.js"
import Marks from "../models/Marks.js";

import { catchAsync } from "../utils/catchAsync.js";
import { successMsg } from "../utils/constants.js";
import { AppError } from "../utils/customError.js";

export const enterMarksForSubject = catchAsync(async (req, res) => {
  const { subjectId } = req.params;
  const { marksData } = req.body;
  const { sessionID, schoolID } = req.user;

  for (const data of marksData) {
    const { studentId, marks } = data;

    await Marks.findOneAndUpdate(
      {
        student: studentId,
        course: subjectId,
        session: sessionID,
      },
      {
        student: studentId,
        course: subjectId,
        session: sessionID,
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

export const getMarksOfStudent = catchAsync(async (req, res) => {
  const { studentid } = req.params;
  const { sessionID } = req.user;

  const student = await Student.findById(studentid)
    .populate({
      path: "class",
      populate: { path: "subjects", select: "name" },
    });

  if (!student) {
    return next(new AppError('Student not found', 404));
  }

  const marks = await Marks.find({
    student: studentid,
    session: sessionID,
  }).populate("course", "name");

  const marksMap = {};
  marks.forEach(m => {
    marksMap[m.course._id.toString()] = m.marksObtained;
  });

  const marksData = student.class.subjects.map(subject => ({
    subjectId: subject._id,
    subjectName: subject.name,
    marks: marksMap[subject._id.toString()] ?? null,
  }));

  const allMarksPresent = marksData.every(m => m.marks !== null);

  res.status(200).json({
    status: successMsg,
    data: { marksData, allMarksPresent },
  });
});


export const getMarksOfSubject = catchAsync(async (req, res) => {
  const { subjectid } = req.params;
  const { sessionID } = req.user;

  const marks = await Marks.find({
    course: subjectid,
    session: sessionID,
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


export const getMarksOfClass = catchAsync(async (req, res) => {
  const { classid } = req.params;
  const { sessionID } = req.user;

  const students = await Student.find({ class: classid }).select("name enroll");

  const marks = await Marks.find({ session: sessionID })
    .populate("course", "name")
    .populate("student", "_id");

  const subjectSet = new Set(marks.map(m => m.course.name));

  const studentMap = {};
  students.forEach(s => {
    studentMap[s._id] = {
      _id: s._id,
      studentName: s.name,
      enrollment: s.enroll,
    };
    subjectSet.forEach(sub => (studentMap[s._id][sub] = null));
  });

  marks.forEach(m => {
    if (studentMap[m.student._id]) {
      studentMap[m.student._id][m.course.name] = m.marksObtained;
    }
  });

  res.status(200).json({
    status: successMsg,
    data: Object.values(studentMap),
  });
});


export const clearMarksForSubject = catchAsync(async (req, res) => {
  const { subjectid } = req.params;
  const { sessionID } = req.user;

  await Marks.deleteMany({
    course: subjectid,
    session: sessionID,
  });

  res.status(200).json({
    status: successMsg,
    message: "Marks cleared for the specified subject",
  });
});


export const clearMarksForClass = catchAsync(async (req, res) => {
  const { classid } = req.params;
  const { sessionID } = req.user;

  const students = await Student.find({ class: classid }).select("_id");

  await Marks.deleteMany({
    student: { $in: students.map(s => s._id) },
    session: sessionID,
  });

  res.status(200).json({
    status: successMsg,
    message: "All marks cleared for the specified class",
  });
});

export const getStudentMarksHistory = catchAsync(async (req, res, next) => {
  const { studentId } = req.params;
  const schoolId = req.user;

  const student = await Student.findById(studentId).select("name enroll");

  if(!student) {
    return next(new AppError('Student not found', 404));
  }

  const marks = await Marks.find({
    student: studentId,
    schoolId,
  })
    .populate({
      path: "course",
      select: "name class",
      populate: {
        path: "class",
        select: "name"
      }
    })
    .populate({
      path: "session",
      select: "name startYear endYear",
    })
    .sort({ "session.startYear": 1});

  const historyMap = {};

  marks.forEach(mark => {
    const sessionId = mark.session._id.toString();

    if(!historyMap[sessionId]) {
      historyMap[sessionId] = {
        sessionId,
        sessionName: mark.session.name,
        className: mark.course.class?.name || "N/A",
        subjects: []
      };
    }

    historyMap[sessionId].subjects.push({
      subkectId: mark.course._id,
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
