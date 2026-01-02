import Course from "../models/Course.js";
import Class from "../models/Class.js";

import fs from "fs";

import { catchAsync } from "../utils/catchAsync.js";
import cloudinary from "../utils/cloudinary.js";

// Create a new course and add it to the class
export const createCourse = catchAsync(async (req, res, next) => {
  req.body.schoolID = req.user.schoolID;
  const newCourse = new Course(req.body);
  
  await Class.updateOne(
    { _id: newCourse.class },
    { $addToSet: { subjects: newCourse._id } }
  );

  let syllabusPicture = null;
  let cloud_id = null;

  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "erp_portal",
    });

    syllabusPicture = result.secure_url;
    cloud_id = result.public_id;

    fs.unlinkSync(req.file.path);
  }

  const savedCourse = await Course.create({
    ...req.body,
    syllabusPicture,
    cloud_id
  });
  res.status(200).json({
    status: 'success',
    data: savedCourse,
    message: "The course has been successfully created"
  });
});

// Update a course
export const updateCourse = catchAsync(async (req, res, next) => {
  const course = await Course.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );
  res.status(200).json({
    status: 'success',
    data: course,
    message: "The course has been successfully updated!"
  });
});

// Delete a course and remove it from the class
export const deleteCourse = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  // Remove course from the class's subjects array
  await Class.findByIdAndUpdate(course.class, { $pull: { subjects: req.params.id } });

  // Delete syllabus image from Cloudinary if it exists
  if (course.cloud_id) {
    await cloudinary.uploader.destroy(course.cloud_id);
  }

  await course.remove();
  res.status(200).json({
    status: 'success',
    message: "The course has been deleted"
  });
});

// Get a course with populated fields
export const getCourse = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.id)
    .populate('class', 'name')
    .populate('teacher', 'teachername');
  res.status(200).json({
    status: 'success',
    data: course
  });
});

// Get all courses with populated fields
export const getCourses = catchAsync(async (req, res, next) => {
  const schoolId = req.user.schoolID;
  let filter = { schoolID: schoolId };
  const courses = await Course.find(filter)
    .populate('class', 'name')
    .populate('teacher', 'teachername');
  res.status(200).json({
    status: 'success',
    data: courses
  });
});

export const setExamDatesForClass = catchAsync(async (req, res, next) => {
  const { classId, exams } = req.body;

  if (!classId || !Array.isArray(exams)) {
    return res.status(400).json({ message: 'classId and exams array are required' });
  }

  // Optional: Validate all exam entries
  const bulkOps = exams.map((exam) => ({
    updateOne: {
      filter: { _id: exam.courseId, class: classId },
      update: {
        $set: {
          'examStatus.status': 'planned',
          'examStatus.examDate': new Date(exam.examDate),
        },
      },
    },
  }));

  const result = await Course.bulkWrite(bulkOps);

  res.status(200).json({
    message: 'Exam dates updated successfully',
    status: "success",
    modifiedCount: result.modifiedCount,
  });
});

// Clear exam date and status for a course
export const clearExamDatesForClass = catchAsync(async (req, res, next) => {
  const { classId } = req.params;

  if (!classId) {
    return res.status(400).json({ message: "classId is required" });
  }

  // Get all course IDs for the class
  const classDoc = await Class.findById(classId).select('subjects');
  if (!classDoc) {
    return res.status(404).json({ message: "Class not found" });
  }

  const courseIds = classDoc.subjects;

  // Clear examStatus fields for all courses in the class
  const result = await Course.updateMany(
    { _id: { $in: courseIds } },
    { $unset: { 'examStatus.examDate': "", 'examStatus.status': "pending" } }
  );

  res.status(200).json({
    status: 'success',
    message: 'Exam dates cleared successfully for all courses in the class',
    modifiedCount: result.modifiedCount
  });
});

export const getExamDatesForClass = catchAsync(async (req, res, next) => {
  const { classId } = req.params;

  const courses = await Course.find({ class: classId })
    .populate('class', 'name')
    .populate('teacher', 'teachername');

  if (!courses || courses.length === 0) {
    return res.status(404).json({
      message: 'No courses found for this class',
      data: [],
      allExamsPlanned: false
    });
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
    status: 'success',
    data: {
      examDates,
      allExamsPlanned,
      className: courses[0].class.name
    }
  });
});

