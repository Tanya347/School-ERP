import Student from "../models/Student.js";
import Class from "../models/Class.js";
import Marks from "../models/Marks.js";
import Attendance from "../models/Attendance.js";
import Test from "../models/Test.js";

import fs from "fs";

import { catchAsync } from "../utils/catchAsync.js";
import { getActiveSession } from "./session.js";
import cloudinary from "../utils/cloudinary.js";
import { folderName, successMsg } from "../utils/constants.js";
import { AppError } from "../utils/customError.js";
import { sendRegistrationEmail } from "../utils/email.js";

// Register a new student
// -----------------------------------------------
export const registerStudent = catchAsync(async (req, res, next) => {
  req.body.schoolID = req.user.schoolID;
  const activeSession = await getActiveSession(req.user);
  req.body.sessionID = activeSession._id;

  const classDoc = await Class.findById(req.body.classID);

  if (!classDoc) {
    return next(new AppError("Invalid class selected", 400));
  }

  const dob = new Date(req.body.dob);
  const today = new Date();

  const age = today.getFullYear() - dob.getFullYear();

  if (age < classDoc.minAge || age > classDoc.maxAge) {
    return next(
      new AppError(
        `Student age must be between ${classDoc.minAge} and ${classDoc.maxAge} for this class`,
        400
      )
    );
  }

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

  if (newUser.classID) {
    await Class.findByIdAndUpdate(newUser.classID, {
      $addToSet: { students: newUser._id }
    });
  }

  // Send registration email with credentials
  try {
    await sendRegistrationEmail(newUser.email, newUser.username, req.body.password, 'Student');
  } catch (error) {
    console.error('Error sending registration email:', error);
  }

  res.status(201).json({
    status: successMsg,
    data: { user: newUser  },
    message: 'Student created successfully!'
  });
})


// Update student details
// -----------------------------------------------
export const updateStudent = catchAsync(async (req, res, next) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    return next(new AppError('Student not found', 404));
  }

  const classDoc = await Class.findById(req.body.classID);

  if (!classDoc) {
    return next(new AppError("Invalid class selected", 400));
  }

  const dob = new Date(req.body.dob);
  const today = new Date();

  const age = today.getFullYear() - dob.getFullYear();

  if (age < classDoc.minAge || age > classDoc.maxAge) {
    return next(
      new AppError(
        `Student age must be between ${classDoc.minAge} and ${classDoc.maxAge} for this class`,
        400
      )
    );
  }

  let profilePicture = student.profilePicture;
  let cloud_id = student.cloud_id;

  // Check if image should be deleted
  if (req.body.isImageDeleted === 'true' || req.body.isImageDeleted === true) {
    // Delete from Cloudinary if exists
    if (student.cloud_id) {
      await cloudinary.uploader.destroy(student.cloud_id);
    }
    profilePicture = null;
    cloud_id = null;
  } else if (req.file) {
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
    "classID"
  ];

  const updates = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined && req.body[field] !== null) {
      updates[field] = req.body[field];
    }
  });

  
  if (updates.classID && typeof updates.classID === "object") {
    updates.classID = updates.classID._id;
  }
  
  updates.profilePicture = profilePicture;
  updates.cloud_id = cloud_id;

  const oldClassId = student.classID?.toString();
  const newClassId = updates.classID?.toString();

  const updatedStudent = await Student.findByIdAndUpdate(
    req.params.id,
    updates,
    {
      new: true,
      runValidators: true
    }
  );

  if (newClassId && newClassId !== oldClassId) {
    // remove from old class
    if (oldClassId) {
      await Class.findByIdAndUpdate(oldClassId, {
        $pull: { students: student._id }
      });
    }

    // add to new class
    await Class.findByIdAndUpdate(newClassId, {
      $addToSet: { students: student._id }
    });
  }

  res.status(200).json({
    status: successMsg,
    data: updatedStudent,
    message: "Student has been updated successfully!"
  });
});


// Delete a student with cascade operations
// -----------------------------------------------
export const deleteStudent = catchAsync(async (req, res, next) => {
  const activeSession = await getActiveSession(req.user);
  const student = await Student.findOne({
    _id: req.params.id,
    schoolID: req.user.schoolID,
    sessionID: activeSession._id
  });

  if (!student) return next(new AppError('Student not found', 404));

  const studentId = student._id;

  // Cascade: Delete related marks
  await Marks.deleteMany({ student: studentId });

  // Cascade: Remove student from attendance records (present/absent arrays)
  await Attendance.updateMany(
    { present: studentId },
    { $pull: { present: studentId } }
  );
  await Attendance.updateMany(
    { absent: studentId },
    { $pull: { absent: studentId } }
  );

  // Cascade: Remove student's marks entries from tests
  await Test.updateMany(
    { "marks.student_id": studentId },
    { $pull: { marks: { student_id: studentId } } }
  );

  // Remove from class students array
  if (student.classID) {
    await Class.findByIdAndUpdate(student.classID, { $pull: { students: studentId } });
  }

  // Delete cloudinary image
  if (student.cloud_id) {
    await cloudinary.uploader.destroy(student.cloud_id);
  }

  await Student.findByIdAndDelete(studentId);

  res.status(200).json({
    status: successMsg,
    message: "Student and all related data have been deleted successfully!"
  });
});


// Bulk delete students with cascade operations
// -----------------------------------------------
export const bulkDeleteStudent = catchAsync(async (req, res, next) => {
  const { ids } = req.body;
  const activeSession = await getActiveSession(req.user);
  const students = await Student.find({
    _id: { $in: ids },
    schoolID: req.user.schoolID,
    sessionID: activeSession._id
  });

  for (const student of students) {
    const studentId = student._id;

    // Cascade: Delete related marks
    await Marks.deleteMany({ student: studentId });

    // Cascade: Remove student from attendance records
    await Attendance.updateMany(
      { present: studentId },
      { $pull: { present: studentId } }
    );
    await Attendance.updateMany(
      { absent: studentId },
      { $pull: { absent: studentId } }
    );

    // Cascade: Remove student's marks entries from tests
    await Test.updateMany(
      { "marks.student_id": studentId },
      { $pull: { marks: { student_id: studentId } } }
    );

    // Remove from class students array
    if (student.classID) {
      await Class.findByIdAndUpdate(student.classID, { $pull: { students: studentId } });
    }

    if (student.cloud_id) {
      await cloudinary.uploader.destroy(student.cloud_id);
    }

    await Student.findByIdAndDelete(studentId);
  }

  res.status(200).json({
    status: successMsg,
    message: "Selected students and all related data have been deleted successfully!"
  });
});


// Get student details
// -----------------------------------------------
export const getStudent = catchAsync(async (req, res, next) => {
  const activeSession = await getActiveSession(req.user);
  const student = await Student.findOne({
      _id: req.params.id,
      schoolID: req.user.schoolID,
      sessionID: activeSession._id
    })
    .populate({
      path: 'classID',
      select: 'name subjects',
      populate: { path: 'subjects', model: 'Course', populate: { path: 'teacher', model: 'Faculty', select: 'teachername' } },
    })
    .exec();

  if (!student) next(new AppError('Student not found', 404));

  const { classID: { name, ...classInfo }, ...rest } = student.toObject();
  const transformedStudent = { ...rest, classname: name, classInfo };

  res.status(200).json({
    status: successMsg,
    data: transformedStudent,
  });
});


// Get single student by ID
// -----------------------------------------------
export const getSingleStudent = catchAsync(async (req, res, next) => {
  const student = await Student.findById(req.params.id).populate('classID', 'name');
  res.status(200).json({
    data: student,
    status: successMsg
  });
});


// Get all students
// -----------------------------------------------
export const getStudents = catchAsync(async (req, res, next) => {
  const schoolId = req.user.schoolID;
  const activeSession = await getActiveSession(req.user);
  let filter = {
      schoolID: schoolId,
      sessionID: activeSession._id
};
  const students = await Student.find(filter).populate('classID', 'name');
  res.status(200).json({
    status: successMsg,
    data: students
  });
});


// Get gender count
// -----------------------------------------------
export const getGenderCount = catchAsync(async (req, res, next) => {
  const schoolId = req.user.schoolID;
  const activeSession = await getActiveSession(req.user);

  const students = await Student.find({ schoolID: schoolId, sessionID: activeSession._id }).select('gender');
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
