import Faculty from "../models/Faculty.js";
import Course from "../models/Course.js";
import Class from "../models/Class.js";

import fs from "fs";

import { AppError } from "../utils/customError.js";
import { catchAsync } from "../utils/catchAsync.js";
import cloudinary from "../utils/cloudinary.js";
import { folderName, successMsg } from "../utils/constants.js";


// Register a new faculty member
// -----------------------------------------------
export const registerFaculty = catchAsync(async (req, res, next) => {
  
  req.body.schoolID = req.user.schoolID;

  const exists = await Faculty.findOne({
    $or: [{ email: req.body.email }, { username: req.body.username }],
    schoolID: req.user.schoolID
  });

  if (exists) {
    return next(new AppError("Faculty already exists", 400));
  }

  let profilePicture = null;
  let cloud_id = null;

  if(req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: folderName,
    });
    profilePicture = result.secure_url;
    cloud_id = result.public_id;

    fs.unlinkSync(req.file.path);
  }

  const newUser  = await Faculty.create({
    ...req.body,
    profilePicture,
    cloud_id,
  });

  res.status(201).json({
    status: successMsg,
    data: { user: newUser  },
    message: 'Faculty created successfully!'
  });
})


// Update a faculty member
// -----------------------------------------------
export const updateFaculty = catchAsync(async (req, res, next) => {
  let profilePicture = null;
  let cloud_id = null;

  const faculty = await Faculty.findById(req.params.id);

  if (!faculty) {
    return next(new AppError('Faculty not found', 404));
  }
  if (req.file) {
    if (faculty.cloud_id) {
      await cloudinary.uploader.destroy(faculty.cloud_id);
    }
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "erp_portal",
    });
    profilePicture = result.secure_url;
    cloud_id = result.public_id;

    fs.unlinkSync(req.file.path);
  } else {
    profilePicture = faculty.profilePicture;
    cloud_id = faculty.cloud_id;
  }

  const allowedFields = [
    "teachername",
    "email",
    "username",
    "facultyPhone",
    "facultyAddress",
    "dob",
    "gender",
    "joiningYear",
    "classTeacherTo"
  ];

  const updates = {};

  allowedFields.forEach(f => {
    if (req.body[f] !== undefined) updates[f] = req.body[f];
  });

  updates.profilePicture = profilePicture;
  updates.cloud_id = cloud_id;

  const updatedFaculty = await Faculty.findOneAndUpdate(
    { _id: req.params.id, schoolID: req.user.schoolID },
    updates,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: successMsg,
    data: updatedFaculty
  });
});


// Delete a faculty member
// -----------------------------------------------
export const deleteFaculty = catchAsync(async (req, res, next) => {

  const faculty = await Faculty.findOne({
    _id: req.params.id,
    schoolID: req.user.schoolID
  });

  if (!faculty) return next(new AppError("Faculty not found", 404));

  await Course.updateMany(
    { teacher: faculty._id },
    { $set: { teacher: null } }
  );

  await Class.updateMany(
    { teachers: faculty._id },
    { $pull: { teachers: faculty._id } }
  );

  if (faculty.cloud_id) {
    await cloudinary.uploader.destroy(faculty.cloud_id);
  }

  await faculty.deleteOne();

  res.status(200).json({
    status: successMsg,
    message: "The Faculty has been deleted"
  });
});


// Bulk delete faculty members
// -----------------------------------------------
export const bulkDeleteFaculty = catchAsync(async (req, res, next) => {
  const ids = req.body.ids;

  // Find all faculty members to be deleted
  const faculties = await Faculty.find({
    _id: { $in: ids },
    schoolID: req.user.schoolID
  });

  for (const faculty of faculties) {

    await Course.updateMany({ teacher: faculty._id }, { $set: { teacher: null } });
    await Class.updateMany({ teachers: faculty._id }, { $pull: { teachers: faculty._id } });

    if (faculty.cloud_id) {
      await cloudinary.uploader.destroy(faculty.cloud_id);
    }
    await faculty.deleteOne();
  }
  res.status(200).json({
    status: successMsg,
    message: "Faculty members deleted successfully"
  });
});


// Get a single faculty member
// -----------------------------------------------
export const getFaculty = catchAsync(async (req, res) => {
  const faculty = await Faculty.findById(req.params.id).populate("classTeacherTo", "name"); ;
  
  const courses = await Course.find({
    teacher: req.params.id,
    schoolID: req.user.schoolID
  }).populate("classID", "name");

  res.status(200).json({
    status: successMsg,
    data: { faculty, courses }
  });
});


// Get all faculty members
// -----------------------------------------------
export const getFacultys = catchAsync(async (req, res, next) => {
  const schoolId = req.user.schoolID;
  const facultys = await Faculty.find({ schoolID: schoolId });
  res.status(200).json({
    status: successMsg,
    data: facultys
  });
});

// Get faculty courses
// -----------------------------------------------
export const getFacultyCourses = catchAsync(async (req, res, next) => {
  const courses = await Course.find({
    teacher: req.params.id,
    schoolID: req.user.schoolID
  }).populate("classID", "name");

  res.status(200).json({ status: successMsg, data: courses });
});


// Get faculty classes
// -----------------------------------------------
export const getFacultyClasses = catchAsync(async (req, res, next) => {
  const facId = req.params.id;

  const courses = await Course.find({ teacher: facId, schoolID: req.user.schoolID });
  
  const classes = await Class.find({
    _id: { $in: courses.map(c => c.classID) }
  });
  res.status(200).json({ status: successMsg, data: classes });
});

// Add a new course to a faculty member
// -----------------------------------------------
export const addNewCourse = catchAsync(async (req, res, next) => {
  const { facId, courseId } = req.params;

  const course = await Course.findById(courseId);

  if (!course) {
    return next(new AppError("Course not found", 404));
  }

  if (course.teacher) {
    return next(
      new AppError("This course is already assigned to a faculty", 400)
    );
  }

  await Class.updateOne(
    { _id: course.classID },
    {
      $addToSet: {
        teachers: facId,
        subjects: courseId,
      },
    }
  );

  await Course.updateOne(
    { _id: courseId },
    {
      $set: { teacher: facId },
    }
  );

  res.status(200).json({
    status: successMsg,
    message: "Course assigned successfully",
  });
});


// Remove a course from a faculty member
// -----------------------------------------------
export const removeCourseFromFaculty = catchAsync(async (req, res, next) => {
  const { facId, courseId } = req.params;

  const course = await Course.findById(courseId);

  if (!course || course.teacher?.toString() !== facId) {
    return next(new AppError("Course not assigned to this faculty", 400));
  }

  // Reset Course
  await Course.updateOne(
    { _id: courseId },
    {
      $set: { teacher: null },
    }
  );

  res.status(200).json({
    status: successMsg,
    message: "Course unassigned successfully",
  });
});


// Change course faculty
// -----------------------------------------------
export const changeCourseFaculty = catchAsync(async (req, res, next) => {
  const { courseId, newFacId } = req.params;

  const course = await Course.findById(courseId);

  if (!course) {
    return next(new AppError("Course not found", 404));
  }

  const oldFacId = course.teacher;

  if (oldFacId?.toString() === newFacId) {
    return next(new AppError("Course already assigned to this faculty", 400));
  }

  // Remove from old faculty
  if (oldFacId) {
    await Class.updateOne(
      { _id: course.classID },
      {
        $pull: { teachers: oldFacId },
      }
    );
  }

  await Class.updateOne(
    { _id: course.classID },
    {
      $addToSet: { teachers: newFacId },
    }
  );

  await Course.updateOne(
    { _id: courseId },
    {
      $set: { teacher: newFacId },
    }
  );

  res.status(200).json({
    status: successMsg,
    message: "Faculty changed successfully",
  });
});


