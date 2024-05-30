import Class from "../models/Class.js";
import Student from "../models/Student.js";
import Attendance from "../models/Attendance.js"

export const createClass = async (req, res, next) => {

    const newClass = new Class(req.body);
    try {
        const savedClass = await newClass.save();
        res.status(200).json(savedClass);
    } catch (err) {
        next(err);
    }
};

export const updateClass = async (req, res, next) => {
    try {
        const sclass = await Class.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(sclass);
    } catch (err) {
        next(err);
    }
};

export const deleteClass = async (req, res, next) => {
    try {
        const deletedClass = await Class.findById(req.params.id);

        if (!deletedClass) {
        return res.status(404).json({ message: 'Class not found' });
        }

        // Remove class reference from associated students
        await Student.updateMany(
        { class: deletedClass._id },
        { $unset: { class: 1 } }
        );

        // Now, delete the class
        await deletedClass.remove();

        res.status(200).json("the Class has been deleted");
    } catch (err) {
        next(err);
    }
};

export const getClassDetails = async (req, res, next) => {
    const classId = req.params.id;
  
    try {
      // Fetch class info with populated subjects and students
      const classInfo = await Class.findById(classId)
        .populate({
          path: 'subjects',
          model: 'Course',
          select: 'name subjectCode teacher',
          populate: {
            path: 'teacher',
            model: 'Faculty',
            select: 'teachername',
          },
        })
        .populate({
          path: 'students',
          model: 'Student',
          select: 'name profilePicture cloud_id gender enroll email studentPhone',
        });
  
      if (!classInfo) {
        return res.status(404).json({ message: 'Class not found' });
      }
  
      // Get total number of lectures for the class
      const totalLectures = await Attendance.countDocuments({ classid: classId });
  
      // If there are no lectures, set the attendance percentage to 0 for all students
      let studentAttendance = classInfo.students.map(student => ({
        _id: student._id,
        name: student.name,
        profilePicture: student.profilePicture,
        cloud_id: student.cloud_id,
        gender: student.gender,
        enroll: student.enroll,
        email: student.email,
        studentPhone: student.studentPhone,
        attendancePercentage: 0,
      }));
  
      if (totalLectures > 0) {
        // Get attendance records for the class
        const attendanceRecords = await Attendance.find({ classid: classId });
  
        // Calculate attendance percentage for each student
        studentAttendance = classInfo.students.map(student => {
          const attendedLectures = attendanceRecords.filter(record => record.present.includes(student._id)).length;
          const attendancePercentage = (attendedLectures / totalLectures) * 100;
  
          return {
            _id: student._id,
            name: student.name,
            profilePicture: student.profilePicture,
            cloud_id: student.cloud_id,
            gender: student.gender,
            enroll: student.enroll,
            email: student.email,
            studentPhone: student.studentPhone,
            attendancePercentage,
          };
        });
      }
  
      // Combine class info with transformed student attendance data
      const classDetails = {
        ...classInfo.toObject(),
        students: studentAttendance,
      };
  
      res.status(200).json(classDetails);
    } catch (err) {
      next(err);
    }
  };
  

export const getClassStudents = async (req, res, next) => {
    const classId = req.params.id;

    try {
        const classStudents = await Class.findById(classId)
        .populate({
            path: 'students',
            model: 'Student',
            select: 'name profilePicture cloud_id gender enroll studentPhone email',
        });

        res.status(200).json(classStudents);
    } catch (err) {
        next(err);
    }
};

export const getClasses = async (req, res, next) => {
    try {
        const classes = await Class.find();
        res.status(200).json(classes);
    } catch (err) {
        next(err)
    }
}

export const getClassesWithSubjects = async(req, res, next) => {
    try {
        const classes = await Class.find().populate({
            path: 'subjects',
            model: 'Course', // Specify the model for the 'subjects' path
          });

        res.status(200).json(classes);
    }
    catch(err) {
        next(err)
    }
}
