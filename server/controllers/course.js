import Course from "../models/Course.js";
import Class from "../models/Class.js";
import Faculty from "../models/Faculty.js";

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
  const course = await Course.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );
  res.status(200).json({
    status: successMsg,
    data: course,
    message: "The course has been successfully updated!"
  });
});


// Delete a course and remove it from the class
// -----------------------------------------------
export const deleteCourse = catchAsync(async (req, res, next) => {

  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(new AppError('Course not found', 404));
  }

  if (course.classID) {
    await Class.findByIdAndUpdate(course.classID, {
      $pull: { subjects: course._id }
    });
  }

  // Delete syllabus image from Cloudinary if it exists
  if (course.cloud_id) {
    await cloudinary.uploader.destroy(course.cloud_id);
  }

  await Course.findByIdAndDelete(course._id);

  res.status(200).json({
    status: successMsg,
    message: "The course has been deleted"
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
  const { classId, exams } = req.body;

  if (!classId || !Array.isArray(exams)) {
    return next(new AppError('classId and exams array are required', 404))
  }

  // Optional: Validate all exam entries
  const bulkOps = exams.map((exam) => ({
    updateOne: {
      filter: { _id: exam.courseId, classID: classId },
      update: {
        $set: {
          'examStatus.status': 'completed',
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

  // Check if all courses have examStatus.status === 'planned'
  const allExamsPlanned = courses.every(
    course => course.examStatus?.status === 'planned'
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

  // 4️⃣ Delete courses
  await Course.deleteMany({ _id: { $in: ids } });

  res.status(200).json({
    status: successMsg,
    message: "Courses deleted successfully"
  });
});


