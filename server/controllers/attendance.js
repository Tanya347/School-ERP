import Attendance from '../models/Attendance.js';
import Class from "../models/Class.js";

import moment from 'moment';

import { catchAsync } from '../utils/catchAsync.js';
import { getActiveSession } from "./session.js";
import { AppError } from '../utils/customError.js';
import { dateFormat, successMsg } from '../utils/constants.js';

// create or update attendance
// --
export const createAttendance = catchAsync(async (req, res) => {
  const { date, present, classid, author } = req.body;
  const schoolID = req.user.schoolID;
  const activeSession = await getActiveSession(req.user);

  // Get all students in the class
  const classInfo = await Class.findById(classid);
  if (!classInfo) {
    return next(new AppError('Class not found', 404));
  }

  const allStudents = classInfo.students;
  const absent = allStudents.filter(studentId => !present.includes(studentId.toString()));

  // Check if attendance already exists for this class and date
  const existingAttendance = await Attendance.findOne({
    classid,
    date: { $gte: new Date(moment(date).startOf('day')), $lte: new Date(moment(date).endOf('day')) }
  });

  if (existingAttendance) {
    // Update only present and absent fields if attendance already exists
    existingAttendance.present = present;
    existingAttendance.absent = absent;
    await existingAttendance.save();

    return res.status(200).json({
      status: successMsg,
      message: 'Attendance updated successfully',
      data: existingAttendance
    });
  }

  // Create new attendance if not exists
  const attendance = new Attendance({
    date,
    present,
    absent,
    classid,
    author,
    schoolID,
    sessionId: activeSession._id
  });
  await attendance.save();
  res.status(201).json({
    status: successMsg,
    message: 'Attendance marked successfully',
    data: attendance
  });
});


// get lecture count 
// --
export const getLectureCount = catchAsync(async (req, res, next) => {
  const { classid } = req.params;
  const lectureCount = await Attendance.countDocuments({ classid });
  res.status(200).json({ 
    status: successMsg,
    data: lectureCount 
  });
});

// get attendance dates of a class
// --
export const getAttendanceDates = catchAsync(async(req, res, next) => {
  const { classid } = req.params;
  const attendances = await Attendance.find({ classid }).select('date present absent');

  // Map through each attendance record to include the counts
  const attendanceSummary = attendances.map(attendance => ({
    id: attendance._id,
    date: attendance.date,
    presentCount: attendance.present.length,
    absentCount: attendance.absent.length,
  }));

  res.status(200).json({
    status: successMsg,
    data: attendanceSummary
  });
});

// get attendance of class on a particular day 
// -
export const getAttendanceStatusByDate = catchAsync(async (req, res, next) => {
  const { classid, date } = req.params;
  
  // Standardize and format the incoming date to YYYY-MM-DD
  const standardizedDate = moment(date).format(dateFormat);

  // Find all attendance records for the specified class
  const attendances = await Attendance.find({ classid }).populate('present absent', 'name enroll');

  // Filter the attendance records by comparing the formatted dates
  const attendance = attendances.find(att => moment(att.date).format(dateFormat) === standardizedDate);

  if (!attendance) {
    return next(new AppError('No attendance record found for the specified date and class', 404));
  }
  
  // Combine present and absent students with their status
  const presentStudents = attendance.present.map(student => ({
    _id: student._id,
    name: student.name,
    enroll: student.enroll,
    status: 'present'
  }));
  
  const absentStudents = attendance.absent.map(student => ({
    _id: student._id,
    name: student.name,
    enroll: student.enroll,
    status: 'absent'
    }));
  
  const studentsStatus = [...presentStudents, ...absentStudents];
  
  res.status(200).json({
    status: successMsg,
    data: studentsStatus
  });
});
  

// clear attendance by class
// --
export const clearAttendanceByClass = catchAsync(async (req, res, next) => {
  const { classid } = req.params;
  
  await Attendance.deleteMany({ classid });
  
  res.status(200).json({ 
    status: successMsg,
    message: `Attendance records for class ${classid} have been cleared successfully` 
  });
});
  

// clear attendance of one day 
// --
export const deleteAttendance = catchAsync(async (req, res, next) => {
  const { id } = req.params; // Attendance ID
  
  const deletedAttendance = await Attendance.findByIdAndDelete(id);
  
  if (!deletedAttendance) {
    return next(new AppError('Attendance record not found', 404));
  }
  
  res.status(200).json({ 
    status: successMsg,
    message: 'Attendance deleted successfully' 
  });
});
  

// get class attendance percent 
// --
export const getClassAttendance = catchAsync(async (req, res, next) => {
  const { classid } = req.params;
  
  // Get total number of lectures for the class
  const totalLectures = await Attendance.countDocuments({ classid });
  
  if (totalLectures === 0) {
    return next(new AppError('No attendance record found for the class', 404));
  }
  
  // Get the class details including all student IDs
  const classInfo = await Class.findById(classid).populate('students', 'name enroll');
  if (!classInfo) {
    return next(new AppError('Class not found', 404));
  }
  
  const attendanceRecords = await Attendance.find({ classid });
  
  const studentAttendance = classInfo.students.map(student => {
    const attendedLectures = attendanceRecords.filter(record => record.present.includes(student._id)).length;
    const attendancePercentage = ((attendedLectures / totalLectures) * 100).toFixed(2);
    return {
      _id: student._id,
      studentId: student.enroll,
      studentName: student.name,
      attendedLectures,
      totalLectures,
      attendancePercentage: parseFloat(attendancePercentage),
      status: attendancePercentage > 75? "Okay" : "Low"
    };
  });
  
  res.status(200).json({
    status: successMsg,
    data: studentAttendance
  });
});
  

// get one student attendance percent
// --
export const getStudentAttendance = catchAsync(async (req, res, next) => {
  const { studentid, classid } = req.params;
  
  // Get total number of lectures for the class
  const totalLectures = await Attendance.countDocuments({ classid });
  
  if (totalLectures === 0) {
    return res.status(404).json({ message: 'No attendance records found for the class' });
  }
  
  // Get number of lectures the student attended
  const attendedLectures = await Attendance.countDocuments({ classid, present: studentid });
  
  const attendancePercentage = ((attendedLectures / totalLectures) * 100).toFixed(2);
  res.status(200).json({ 
    status: successMsg,
    data: {
      attendedLectures, 
      totalLectures, 
      attendancePercentage: parseFloat(attendancePercentage), 
      attendanceStatus: attendancePercentage > 75? "Okay" : "Low" 
    }
  });
});
  
// get one student attendance
// --
export const getStudentPresenceDates = catchAsync(async (req, res, next) => {
  const { classid, studentid } = req.params;
  
  // Find attendance records where the student is present
  const presentRecords = await Attendance.find({ classid, present: studentid }).select('date');
  
  const presenceDates = presentRecords.map(record => record.date);
  
  res.status(200).json({ 
    status: successMsg,
    data: presenceDates
  });
});

// get one student absence
// --
export const getStudentAbsenceDates = catchAsync(async (req, res, next) => {
  const { classid, studentid } = req.params;
  
  // Find attendance records where the student is absent
  const absentRecords = await Attendance.find({ classid, absent: studentid }).select('date');
  
  const absenceDates = absentRecords.map(record => record.date);
  
  res.status(200).json({ 
    status: successMsg,
    data: absenceDates 
  });
});
  

// clear all attendance records
// --
export const clearAllAttendanceRecords = catchAsync(async (req, res, next) => {
  await Attendance.deleteMany({});
  res.status(200).json({ 
    status: successMsg,
    message: 'All attendance records have been cleared successfully' 
  });
});
  
