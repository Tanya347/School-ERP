import moment from 'moment';
import Attendance from '../models/Attendance.js';
import Class from "../models/Class.js";
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/customError.js';

export const createAttendance = catchAsync(async (req, res, next) => {
  const { date, present, classid, author } = req.body;

  // Get all students in the class
  const classInfo = await Class.findById(classid);
  if (!classInfo) {
    return res.status(404).json({ message: 'Class not found' });
  }

  const allStudents = classInfo.students;
  const absent = allStudents.filter(studentId => !present.includes(studentId.toString()));
    
  const attendance = new Attendance({
    date,
    present,
    absent,
    classid,
    author
  });

  await attendance.save();
  res.status(201).json({ 
    status: 'success',
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
    status: 'success',
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
    status: 'success',
    data: attendanceSummary
  });
});

// edit attendance --
export const editAttendance = catchAsync(async (req, res, next) => {
  const { id } = req.params; // Attendance ID
  const { date, present, classid, author } = req.body;
  
  // Get all students in the class
  const classInfo = await Class.findById(classid).populate('students');
  if (!classInfo) {
    return next(new AppError('Class does not exist', 404));
  }
  
  const allStudents = classInfo.students.map(student => student._id);
  const absent = allStudents.filter(studentId => !present.includes(studentId));
  
  const updatedAttendance = await Attendance.findByIdAndUpdate(id, {
    date,
    present,
    absent,
    classid,
    author
  }, { new: true });
  
  if (!updatedAttendance) {
    return next(new AppError('Attendance record not found!', 404));
  }
  
  res.status(200).json({ 
    status: 'success',
    message: 'Attendance updated successfully', 
    data: updatedAttendance 
  });
});
  

// get attendance of class on a particular day 
// -
export const getAttendanceStatusByDate = catchAsync(async (req, res, next) => {
  const { classid, date } = req.params;
  
  // Standardize and format the incoming date to YYYY-MM-DD
  const standardizedDate = moment(date).format('YYYY-MM-DD');

  // Find all attendance records for the specified class
  const attendances = await Attendance.find({ classid }).populate('present absent', 'name enroll');

  // Filter the attendance records by comparing the formatted dates
  const attendance = attendances.find(att => moment(att.date).format('YYYY-MM-DD') === standardizedDate);

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
    status: 'success',
    studentsStatus
  });
});
  

// clear attendance by class
export const clearAttendanceByClass = catchAsync(async (req, res, next) => {
  const { classid } = req.params;
  
  await Attendance.deleteMany({ classid });
  
  res.status(200).json({ 
    status: 'success',
    message: `Attendance records for class ${classid} have been cleared successfully` 
  });
});
  

// clear attendance of one day 

export const deleteAttendance = catchAsync(async (req, res, next) => {
  const { id } = req.params; // Attendance ID
  
  const deletedAttendance = await Attendance.findByIdAndDelete(id);
  
  if (!deletedAttendance) {
    return res.status(404).json({ message: 'Attendance record not found' });
  }
  
  res.status(200).json({ 
    status: 'success',
    message: 'Attendance deleted successfully' 
  });
});
  

// get class attendance percent 

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
    status: 'success',
    data: studentAttendance
  });
});
  

// get one student attendance percent

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
    status: 'success',
    data: {
      attendedLectures, 
      totalLectures, 
      attendancePercentage: parseFloat(attendancePercentage), 
      attendanceStatus: attendancePercentage > 75? "Okay" : "Low" 
    }
  });
});
  
// get one student attendance

export const getStudentPresenceDates = catchAsync(async (req, res, next) => {
  const { classid, studentid } = req.params;
  
  // Find attendance records where the student is present
  const presentRecords = await Attendance.find({ classid, present: studentid }).select('date');
  
  const presenceDates = presentRecords.map(record => record.date);
  
  res.status(200).json({ 
    status: 'success',
    data: presenceDates
  });
});

export const getStudentAbsenceDates = catchAsync(async (req, res, next) => {
  const { classid, studentid } = req.params;
  
  // Find attendance records where the student is absent
  const absentRecords = await Attendance.find({ classid, absent: studentid }).select('date');
  
  const absenceDates = absentRecords.map(record => record.date);
  
  res.status(200).json({ 
    status: 'success',
    data: absenceDates 
  });
});
  

// clear all attendance

export const clearAllAttendanceRecords = catchAsync(async (req, res, next) => {
  await Attendance.deleteMany({});
  res.status(200).json({ 
    status: 'success',
    message: 'All attendance records have been cleared successfully' 
  });
});
  
