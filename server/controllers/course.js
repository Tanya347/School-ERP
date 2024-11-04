import Course from "../models/Course.js";
import Class from "../models/Class.js";
import { catchAsync } from "../utils/catchAsync.js";

// Create a new course and add it to the class
export const createCourse = catchAsync(async (req, res, next) => {
  const newCourse = new Course(req.body);

  // Add course to the class's subjects array
  await Class.updateOne(
    { _id: newCourse.class },
    { $addToSet: { subjects: newCourse._id } }
  );

  const savedCourse = await newCourse.save();
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

// Get a single course without populating fields
export const getSingleCourse = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: course
  });
});

// Get all courses with populated fields
export const getCourses = catchAsync(async (req, res, next) => {
  const courses = await Course.find()
    .populate('class', 'name')
    .populate('teacher', 'teachername');
  res.status(200).json({
    status: 'success',
    data: courses
  });
});
