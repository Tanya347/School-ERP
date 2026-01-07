import Student from "../models/Student.js";
import Class from "../models/Class.js";

import fs from "fs";

import { catchAsync } from "../utils/catchAsync.js";
import { getActiveSession } from "./session.js";
import cloudinary from "../utils/cloudinary.js";
import { folderName, successMsg } from "../utils/constants.js";

export const registerStudent = catchAsync(async (req, res, next) => {
  req.body.schoolID = req.user.schoolID;
  const activeSession = await getActiveSession(req.user);
  req.body.sessionID = activeSession._id;

  // image upload handler
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
  const newUser  = await Student.create({
    ...req.body,
    profilePicture,
    cloud_id,
  });
  res.status(201).json({
    status: successMsg,
    data: { user: newUser  },
    message: 'Student created successfully!'
  });
})

export const updateStudent = catchAsync(async (req, res, next) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    return next(new AppError('Student not found', 404));
  }

  let profilePicture = student.profilePicture;
  let cloud_id = student.cloud_id;

  if (req.file) {
    if (student.cloud_id) {
      await cloudinary.uploader.destroy(student.cloud_id);
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: folderName,
    });

    profilePicture = result.secure_url;
    cloud_id = result.public_id;

    fs.unlinkSync(req.file.path);
  }

  const allowedFields = [
    "name",
    "email",
    "username",
    "studentPhone",
    "studentAddress",
    "dob",
    "gender",
    "passedOut",
    "class"
  ];

  const updates = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  if (updates.class && typeof updates.class === "object") {
    updates.class = updates.class._id;
  }

  updates.profilePicture = profilePicture;
  updates.cloud_id = cloud_id;

  const updatedStudent = await Student.findByIdAndUpdate(
    req.params.id,
    updates,
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    status: successMsg,
    data: updatedStudent,
    message: "Student has been updated successfully!"
  });
});

export const deleteStudent = catchAsync(async (req, res, next) => {
  const student = await Student.findById(req.params.id);
  if (!student) return next(new AppError('Student not found', 404));
  if (student.cloud_id) {
    await cloudinary.uploader.destroy(student.cloud_id);
  }
  await Class.findByIdAndUpdate(student.class, { $pull: { students: req.params.id } });
  await student.remove();
  res.status(200).json({
    status: successMsg,
    message: "Student has been deleted successfully!"
  });
});

export const bulkDeleteStudent = catchAsync(async (req, res, next) => {
  const { ids } = req.body; // Expecting an array of student IDs in the request body

  const students = await Student.find({ _id: { $in: ids } });

  for (const student of students) {
    if (student.cloud_id) {
      await cloudinary.uploader.destroy(student.cloud_id);
    }
    await Class.findByIdAndUpdate(student.class, { $pull: { students: student._id } });
    await student.remove();
  }

  res.status(200).json({
    status: successMsg,
    message: "Selected students have been deleted successfully!"
  });
});

export const getStudent = catchAsync(async (req, res, next) => {
  const student = await Student.findById(req.params.id)
    .populate({
      path: 'class',
      select: 'name subjects',
      populate: { path: 'subjects', model: 'Course', populate: { path: 'teacher', model: 'Faculty', select: 'teachername' } },
    })
    .exec();

  if (!student) next(new AppError('Student not found', 404));

  const { class: { name, ...classInfo }, ...rest } = student.toObject();
  const transformedStudent = { ...rest, classname: name, classInfo };

  res.status(200).json({
    status: successMsg,
    data: transformedStudent,
  });
});

export const getSingleStudent = catchAsync(async (req, res, next) => {
  const student = await Student.findById(req.params.id).populate('class', 'name');
  res.status(200).json({
    data: student,
    status: successMsg
  });
});

export const getStudents = catchAsync(async (req, res, next) => {
  const schoolId = req.user.schoolID;
  let filter = { schoolID: schoolId };
  const students = await Student.find(filter).populate('class', 'name');
  res.status(200).json({
    status: successMsg,
    data: students
  });
});

export const getGenderCount = catchAsync(async (req, res, next) => {
  const schoolId = req.user.schoolID;
  const students = await Student.find({ schoolID: schoolId }).select('gender');
  let boys = 0, girls = 0;
  students.forEach(student => {
    if (student.gender && student.gender.toLowerCase() === 'male') boys++;
    if (student.gender && student.gender.toLowerCase() === 'female') girls++;
  });
  res.status(200).json({
    status: successMsg,
    data: { boys, girls }
  });
});
