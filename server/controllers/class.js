import Class from "../models/Class.js";
import Student from "../models/Student.js";
import Faculty from "../models/Faculty.js";

import { catchAsync } from "../utils/catchAsync.js";
import { successMsg } from "../utils/constants.js";

// Create a new class
export const createClass = catchAsync(async (req, res, next) => {
  req.body.schoolID = req.user.schoolID;
  const newClass = new Class(req.body);
  const savedClass = await newClass.save();
  res.status(200).json({
    status: successMsg,
    data: savedClass,
    message: 'Class created successfully!'
  });
});

// Update an existing class
export const updateClass = catchAsync(async (req, res, next) => {
  const sclass = await Class.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );
  res.status(200).json({
    status: successMsg,
    data: sclass,
    message: 'Class updated successfully!'
  });
});

// Delete a class and unset class reference from students
export const deleteClass = catchAsync(async (req, res, next) => {
  const deletedClass = await Class.findById(req.params.id);
  if (!deletedClass) {
    return next(new AppError('Class not found', 404));
  }

  // Remove class reference from associated students
  await Student.updateMany(
    { class: deletedClass._id },
    { $unset: { class: 1 } }
  );

  // Delete the class
  await deletedClass.remove();
  res.status(200).json({
    message: "The class has been deleted",
    status: successMsg
  });
});

// Get class details with populated subjects and students
export const getClassDetails = catchAsync(async (req, res, next) => {
  const classId = req.params.id;
  const classDetails = await Class.findById(classId)
    .populate({
      path: 'subjects',
      model: 'Course',
      select: 'name subjectCode teacher syllabusPicture',
      populate: {
        path: 'teacher',
        model: 'Faculty',
        select: '_id teachername',
      },
    })
    .populate({
      path: 'students',
      model: 'Student',
      select: 'name profilePicture cloud_id gender enroll email studentPhone',
    })
    .populate({
      path: 'classTeacher',
      model: 'Faculty',
      select: 'teachername',
    });

  // Extract unique teachers from subjects
  let teachers = [];
  if (classDetails && classDetails.subjects) {
    const teacherMap = new Map();
    classDetails.subjects.forEach(sub => {
      if (sub.teacher && sub.teacher._id) {
        teacherMap.set(sub.teacher._id.toString(), {
          _id: sub.teacher._id,
          name: sub.teacher.teachername
        });
      }
    });
    teachers = Array.from(teacherMap.values());
  }
  // Attach teachers array to response
  classDetails._doc.teachers = teachers;
  res.status(200).json({
    data: classDetails,
    status: successMsg
  });
});

// Get class subjects
export const getClassSubjects = catchAsync(async (req, res, next) => {
  const classId = req.params.id;
  const courses = await Class.findById(classId).populate('subjects');
  const subjects = courses.subjects.map((sub) => ({
    _id: sub._id,
    name: sub.name,
    code: sub.subjectCode,
    teacher: sub.teacher
  }));
  res.status(200).json({
    data: subjects,
    status: successMsg
  });
});

// Get class students
export const getClassStudents = catchAsync(async (req, res, next) => {
  const classId = req.params.id;
  const classStudents = await Class.findById(classId).populate({
    path: 'students',
    model: 'Student',
    select: 'name profilePicture cloud_id gender enroll studentPhone email',
  });
  res.status(200).json({
    data: classStudents,
    status: successMsg
  });
});

// Get all classes
export const getClasses = catchAsync(async (req, res, next) => {
  const schoolId = req.user.schoolID;
  let filter = { schoolID: schoolId };
  const classes = await Class.find(filter).sort({classNumber: 1});
  res.status(200).json({
    data: classes,
    status: successMsg
  });
});

// Get all classes with subjects populated
export const getClassesWithSubjects = catchAsync(async (req, res, next) => {
  const schoolId = req.user.schoolID;
  let filter = { schoolID: schoolId };
  const classes = await Class.find(filter).populate({
    path: 'subjects',
    model: 'Course',
  }).sort({classNumber: 1});
  res.status(200).json({
    data: classes,
    status: successMsg
  });
});

export const addClassTeacher = catchAsync(async (req, res, next) => {
  const classId = req.params.id;
  const teacherId = req.body.teacher;

  // Check if the class already has a class teacher
  const sclass = await Class.findById(classId).populate('classTeacher');
  if (!sclass) {
    return next(new AppError('Class not found', 404));
  }

  const teacher = await Faculty.findById(teacherId).populate('classTeacherTo');
  if (!teacher) {
    return next(new AppError('Teacher not found', 404));
  }
  if (teacher.classTeacherTo) {
    return next(new AppError('Class not found', 404));
    return res.status(400).json({ message: 'This teacher is already assigned as a class teacher to another class.' });
  }

  // Set the classTeacher field in Class and classTeacherTo in Faculty
  sclass.classTeacher = teacherId;
  await sclass.save();

  teacher.classTeacherTo = classId;
  await teacher.save();

  res.status(200).json({
    status: successMsg,
    message: 'Class teacher assigned successfully!',
    data: {
      class: sclass,
      teacher: teacher
    }
  });
});