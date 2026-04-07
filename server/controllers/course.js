import Course from "../models/Course.js";
import Class from "../models/Class.js";
import Task from "../models/Task.js";
import Test from "../models/Test.js";
import Marks from "../models/Marks.js";
import TimetableSlot from "../models/Timetable.js";

import fs from "fs";

import { catchAsync } from "../utils/catchAsync.js";
import cloudinary from "../utils/cloudinary.js";
import { AppError } from "../utils/customError.js";

import { successMsg, folderName } from "../utils/constants.js";


// Create a new course and add it to the class
// -----------------------------------------------
export const createCourse = catchAsync(async (req, res, next) => {
  req.body.schoolID = req.user.schoolID;
  const newCourse = new Course(req.body);
  
  let syllabusPicture = null;
  let cloud_id = null;

  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: folderName,
    });

    syllabusPicture = result.secure_url;
    cloud_id = result.public_id;

    fs.unlinkSync(req.file.path);
  }

  const course = await Course.create({
    ...req.body,
    syllabusPicture,
    cloud_id,
  });

  // Link to Class
  await Class.findByIdAndUpdate(course.classID, {
    $addToSet: { subjects: course._id },
  });

  res.status(200).json({
    status: successMsg,
    data: course,
    message: "The course has been successfully created"
  });
});


// Update a course
// -----------------------------------------------
export const updateCourse = catchAsync(async (req, res, next) => {


  const course = await Course.findById(req.params.id);

  let syllabusPicture = null;
  let cloud_id = null;

  // Check if image should be deleted
  if (req.body.isImageDeleted === 'true' || req.body.isImageDeleted === true) {
    // Delete from Cloudinary if exists
    if (course.cloud_id) {
      await cloudinary.uploader.destroy(course.cloud_id);
    }
    syllabusPicture = null;
    cloud_id = null;
  } else if (req.file) {
    // Delete old image from Cloudinary if exists
    if (course.cloud_id) {
      await cloudinary.uploader.destroy(course.cloud_id);
    }
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: folderName,
    });

    syllabusPicture = result.secure_url;
    cloud_id = result.public_id;

    fs.unlinkSync(req.file.path);
  } else {
    syllabusPicture = course.syllabusPicture;
    cloud_id = course.cloud_id;
  }

  const updatedCourse = await Course.findByIdAndUpdate(
    req.params.id,
    { $set: { ...req.body, syllabusPicture, cloud_id } },
    { new: true }
  );

  res.status(200).json({
    status: successMsg,
    data: updatedCourse,
    message: "The course has been successfully updated!"
  });
});


// Delete a course with cascade operations
// -----------------------------------------------
export const deleteCourse = catchAsync(async (req, res, next) => {

  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(new AppError('Course not found', 404));
  }

  const courseId = course._id;
  
  if (course.classID) {
    await Class.findByIdAndUpdate(course.classID, {
      $pull: { subjects: courseId }
    });
  }

  await Task.deleteMany({ courseID: courseId });

  await Test.deleteMany({ subject: courseId });

  await Marks.deleteMany({ course: courseId });

  await TimetableSlot.deleteMany({ courseID: courseId });

  // Delete syllabus image from Cloudinary if it exists
  if (course.cloud_id) {
    await cloudinary.uploader.destroy(course.cloud_id);
  }

  await Course.findByIdAndDelete(courseId);

  res.status(200).json({
    status: successMsg,
    message: "The course and all related data have been deleted"
  });
});


// Get a course with populated fields
// -----------------------------------------------
export const getCourse = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.id)
    .populate('classID', 'name')
    .populate('teacher', 'teachername');
  res.status(200).json({
    status: successMsg,
    data: course
  });
});


// Get all courses with populated fields
// -----------------------------------------------
export const getCourses = catchAsync(async (req, res, next) => {
  const schoolId = req.user.schoolID;
  let filter = { schoolID: schoolId };
  const courses = await Course.find(filter)
    .populate('classID', 'name')
    .populate('teacher', 'teachername');
  res.status(200).json({
    status: successMsg,
    data: courses
  });
});


// Set exam dates for multiple courses in a class
// -----------------------------------------------
export const setExamDatesForClass = catchAsync(async (req, res, next) => {
  const { classID, exams } = req.body;

  if (!classID || !Array.isArray(exams)) {
    return next(new AppError('classId and exams array are required', 404))
  }

  // Optional: Validate all exam entries
  const bulkOps = exams.map((exam) => ({
    updateOne: {
      filter: { _id: exam.courseId, classID },
      update: {
        $set: {
          'examStatus.status': 'dates_published',
          'examStatus.examDate': new Date(exam.examDate),
        },
      },
    },
  }));

  const result = await Course.bulkWrite(bulkOps);

  res.status(200).json({
    message: 'Exam dates updated successfully',
    status: successMsg,
    modifiedCount: result.modifiedCount,
  });
});


// Clear exam date and status for a course
// -----------------------------------------------
export const clearExamDatesForClass = catchAsync(async (req, res, next) => {
  const { classId } = req.params;

  if (!classId) {
    return next(new AppError('classId parameter is required', 404));
  }

  // Get all course IDs for the class
  const classDoc = await Class.findById(classId).select('subjects');
  if (!classDoc) {
    return next(new AppError('Class not found', 404));
  }

  const courseIds = classDoc.subjects;

  // Clear examStatus fields for all courses in the class
  const result = await Course.updateMany(
    { classID: classId },
    {
      $set: { 'examStatus.status': 'pending' },
      $unset: { 'examStatus.examDate': "" }
    }
  );

  res.status(200).json({
    status: successMsg,
    message: 'Exam dates cleared successfully for all courses in the class',
    modifiedCount: result.modifiedCount
  });
});


// Get exam dates for all courses in a class
// -----------------------------------------------
export const getExamDatesForClass = catchAsync(async (req, res, next) => {
  const { classId } = req.params;

  const courses = await Course.find({ classID: classId })
    .populate('classID', 'name')
    .populate('teacher', 'teachername');

  if (!courses || courses.length === 0) {
    return next(new AppError('No courses found for the specified class', 404));
  }

  const examDates = courses.map(course => ({
    _id: course._id,
    name: course.name,
    examDate: course.examStatus?.examDate || null,
    teacherName: course.teacher?.teachername || 'N/A',
    code: course.subjectCode,
  }));

  // Check if all courses have examStatus.status === 'pending'
  const allExamsPlanned = courses.every(
    course => course.examStatus?.status !== 'pending'
  );

  res.status(200).json({
    status: successMsg,
    data: {
      examDates,
      allExamsPlanned,
      className: courses[0].classID.name
    }
  });
});


// Bulk delete courses
// -----------------------------------------------
export const bulkDeleteCourse = catchAsync(async (req, res, next) => {
  const { ids } = req.body;

  const courses = await Course.find({ _id: { $in: ids } });

  if (!courses.length) {
    return next(new AppError("No courses found", 404));
  }

  // 1️⃣ Remove syllabus images
  for (const course of courses) {
    if (course.cloud_id) {
      await cloudinary.uploader.destroy(course.cloud_id);
    }
  }

  // 2️⃣ Remove courses from Class.subjects
  const classIds = courses
    .map(course => course.classID)
    .filter(Boolean);

  if (classIds.length) {
    await Class.updateMany(
      { _id: { $in: classIds } },
      { $pull: { subjects: { $in: ids } } }
    );
  }

  await Task.deleteMany({ courseID: { $in: ids } });

  await Test.deleteMany({ subject: { $in: ids } });

  await Marks.deleteMany({ course: { $in: ids } });

  await TimetableSlot.deleteMany({ courseID: { $in: ids } });

  await Course.deleteMany({ _id: { $in: ids } });

  res.status(200).json({
    status: successMsg,
    message: "Courses and all related data deleted successfully"
  });
});


// Get students under a course
// -----------------------------------------------
export const getStudentsInCourse = catchAsync(async (req, res, next) => {
  const courseId = req.params.courseId;

  const course = await Course.findById(courseId);

  if (!course) {
    return next(new AppError('Course not found', 404));
  }

  const classID = course.classID;

  const classDoc = await Class.findById(classID).populate('students').populate({
    path: 'students',
    select: 'name profilePicture email enroll gender studentPhone'
  });

  if (!classDoc) {
    return next(new AppError('Class not found', 404));
  }

  res.status(200).json({
    status: successMsg,
    data: classDoc.students
  });
});