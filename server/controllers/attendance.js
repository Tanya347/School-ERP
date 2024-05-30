import moment from 'moment';
import Attendance from '../models/Attendance.js';
import Class from "../models/Class.js";

// --
export const createAttendance = async (req, res, next) => {
  try {
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
    res.status(201).json({ message: 'Attendance marked successfully', attendance });
  } catch (error) {
    next(error);
  }
};


// get lecture count 
// --
export const getLectureCount = async (req, res, next) => {
    try {
      const { classid } = req.params;
      const lectureCount = await Attendance.countDocuments({ classid });
      res.status(200).json({ lectureCount });
    } catch (error) {
      next(error);
    }
  };

// get attendance dates of a class
// --
export const getAttendanceDates = async(req, res, next) => {
    try {
        const { classid } = req.params;
        const attendances = await Attendance.find({ classid }).select('date present absent');

        // Map through each attendance record to include the counts
        const attendanceSummary = attendances.map(attendance => ({
          id: attendance._id,
          date: attendance.date,
          presentCount: attendance.present.length,
          absentCount: attendance.absent.length,
        }));

        res.status(200).json(attendanceSummary);
    } catch(error) {
        next(error);
    }
}

// edit attendance --

export const editAttendance = async (req, res, next) => {
    try {
      const { id } = req.params; // Attendance ID
      const { date, present, classid, author } = req.body;
  
      // Get all students in the class
      const classInfo = await Class.findById(classid).populate('students');
      if (!classInfo) {
        return res.status(404).json({ message: 'Class not found' });
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
        return res.status(404).json({ message: 'Attendance record not found' });
      }
  
      res.status(200).json({ message: 'Attendance updated successfully', updatedAttendance });
    } catch (error) {
      next(error);
    }
  };
  

// get attendance of class on a particular day 
// -
export const getAttendanceStatusByDate = async (req, res, next) => {
    try {
      const { classid, date } = req.params;
  
      // Standardize and format the incoming date to YYYY-MM-DD
      const standardizedDate = moment(date).format('YYYY-MM-DD');

      // Find all attendance records for the specified class
      const attendances = await Attendance.find({ classid }).populate('present absent', 'name enroll');

      // Filter the attendance records by comparing the formatted dates
      const attendance = attendances.find(att => moment(att.date).format('YYYY-MM-DD') === standardizedDate);

      if (!attendance) {
        return res.status(404).json({ message: 'No attendance record found for the specified date and class' });
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
  
      res.status(200).json(studentsStatus);
    } catch (error) {
      next(error);
    }
  };
  

// clear attendance by class

export const clearAttendanceByClass = async (req, res, next) => {
    try {
      const { classid } = req.params;
  
      await Attendance.deleteMany({ classid });
  
      res.status(200).json({ message: `Attendance records for class ${classid} have been cleared successfully` });
    } catch (error) {
      next(error);
    }
  };
  

// clear attendance of one day 

export const deleteAttendance = async (req, res, next) => {
    try {
      const { id } = req.params; // Attendance ID
  
      const deletedAttendance = await Attendance.findByIdAndDelete(id);
  
      if (!deletedAttendance) {
        return res.status(404).json({ message: 'Attendance record not found' });
      }
  
      res.status(200).json({ message: 'Attendance deleted successfully' });
    } catch (error) {
      next(error);
    }
  };
  

// get class attendance percent 

export const getClassAttendance = async (req, res, next) => {
    try {
      const { classid } = req.params;
  
      // Get total number of lectures for the class
      const totalLectures = await Attendance.countDocuments({ classid });
  
      if (totalLectures === 0) {
        return res.status(404).json({ message: 'No attendance records found for the class' });
      }
  
      // Get the class details including all student IDs
      const classInfo = await Class.findById(classid);
      if (!classInfo) {
        return res.status(404).json({ message: 'Class not found' });
      }
  
      const attendanceRecords = await Attendance.find({ classid });
  
      const studentAttendance = classInfo.students.map(student => {
        const attendedLectures = attendanceRecords.filter(record => record.present.includes(student._id)).length;
        const attendancePercentage = (attendedLectures / totalLectures) * 100;
        return {
          studentId: student.enroll,
          studentName: student.name,
          attendedLectures,
          totalLectures,
          attendancePercentage
        };
      });
  
      res.status(200).json(studentAttendance);
    } catch (error) {
      next(error);
    }
  };
  

// get one student attendance percent

export const getStudentAttendance = async (req, res, next) => {
    try {
      const { studentid, classid } = req.params;
  
      // Get total number of lectures for the class
      const totalLectures = await Attendance.countDocuments({ classid });
  
      if (totalLectures === 0) {
        return res.status(404).json({ message: 'No attendance records found for the class' });
      }
  
      // Get number of lectures the student attended
      const attendedLectures = await Attendance.countDocuments({ classid, present: studentid });
  
      const attendancePercentage = (attendedLectures / totalLectures) * 100;
      res.status(200).json({ attendedLectures, totalLectures, attendancePercentage });
    } catch (error) {
      next(error);
    }
  };
  

// get one student attendance

export const getStudentPresenceDates = async (req, res, next) => {
    try {
      const { classid, studentid } = req.params;
  
      // Find attendance records where the student is present
      const presentRecords = await Attendance.find({ classid, present: studentid }).select('date');
  
      const presenceDates = presentRecords.map(record => record.date);
  
      res.status(200).json({ presenceDates });
    } catch (error) {
      next(error);
    }
  };

  export const getStudentAbsenceDates = async (req, res, next) => {
    try {
      const { classid, studentid } = req.params;
  
      // Find attendance records where the student is absent
      const absentRecords = await Attendance.find({ classid, absent: studentid }).select('date');
  
      const absenceDates = absentRecords.map(record => record.date);
  
      res.status(200).json({ absenceDates });
    } catch (error) {
      next(error);
    }
  };
  
  

// clear all attendance

export const clearAllAttendanceRecords = async (req, res, next) => {
    try {
      await Attendance.deleteMany({});
      res.status(200).json({ message: 'All attendance records have been cleared successfully' });
    } catch (error) {
      next(error);
    }
  };
  
