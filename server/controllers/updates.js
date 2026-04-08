import Update from "../models/Update.js";
import Faculty from "../models/Faculty.js";

import { catchAsync } from "../utils/catchAsync.js";
import { getActiveSession } from "./session.js";
import { successMsg } from "../utils/constants.js";
import { AppError } from "../utils/customError.js";


// Create an update
// -----------------------------------------------
export const createUpdate = catchAsync(async (req, res, next) => {
    req.body.schoolID = req.user.schoolID;
    const activeSession = await getActiveSession(req.user);
    req.body.sessionID = activeSession._id;

    // Set author based on user role
    req.body.author = req.user._id;
    if (req.user.role === 'admin') {
        req.body.authorType = 'Admin';
    } else if (req.user.role === 'faculty') {
        req.body.authorType = 'Faculty';
    }

    const newUpdate = new Update(req.body);
    const savedUpdate = await newUpdate.save();
    res.status(200).json({
        status: successMsg,
        message: 'Update created successfully!',
        data: savedUpdate
    });
});


// Edit an update
// -----------------------------------------------
export const updateUpdate = catchAsync(async (req, res, next) => {
    const update = await Update.findById(req.params.id);

    if (!update) {
        return next(new AppError('Update not found', 404));
    }

    if (update.schoolID.toString() !== req.user.schoolID.toString()) {
        return next(new AppError('Not authorized to edit this update', 403));
    }

    if (update.author.toString() !== req.user._id.toString()) {
        return next(new AppError('Not authorized to edit this update', 403));
    }

    const updatedUpdate = await Update.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
    ).populate("classID", "name");

    res.status(200).json({
        status: successMsg,
        message: 'Update edited successfully!',
        data: updatedUpdate
    });
});


// Delete an update
// -----------------------------------------------
export const deleteUpdate = catchAsync(async (req, res, next) => {
    const update = await Update.findById(req.params.id);
    if (!update) {
        return next(new AppError('Update not found', 404));
    }
    if (update.schoolID.toString() !== req.user.schoolID.toString()) {
        return next(new AppError('Not authorized to delete this update', 403));
    }
    if (update.author.toString() !== req.user._id.toString()) {
        return next(new AppError('Not authorized to delete this update', 403));
    }
    await Update.findByIdAndDelete(req.params.id);
    res.status(200).json({
        status: successMsg,
        message: 'Update deleted successfully!',
    });
});


// Bulk delete updates
// -----------------------------------------------
export const bulkDeleteUpdate = catchAsync(async (req, res, next) => {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return next(new AppError("No IDs provided for deletion", 400));
    }
    await Update.deleteMany({
        _id: { $in: ids },
        schoolID: req.user.schoolID,
        author: req.user._id
    });
    res.status(200).json({
        status: successMsg,
        message: `${ids.length} updates deleted successfully!`,
    });
});


// Get a single update
// -----------------------------------------------
export const getUpdate = catchAsync(async (req, res, next) => {
    const update = await Update.findById(req.params.id).populate("classID", "name");
    if (!update) {
        return next(new AppError('Update not found', 404));
    }
    if (update.schoolID.toString() !== req.user.schoolID.toString()) {
        return next(new AppError('Not authorized to view this update', 403));
    }
    res.status(200).json({
        status: successMsg,
        data: update
    });
});


// Get updates for the user based on role
// -----------------------------------------------
export const getUpdates = catchAsync(async (req, res) => {
  const now = new Date();

  const filter = {
    schoolID: req.user.schoolID,
    expiresAt: { $gt: now }
  };

  // Student → class based
  if (req.user.role === "student") {
    filter.$or = [
      { updateType: "general" },
      { updateType: "specific", classID: req.user.classID }
    ];
  }

  // Faculty → their class teacher class
  if (req.user.role === "faculty") {
    const faculty = await Faculty.findById(req.user._id);
    filter.$or = [
      { updateType: "general" },
      { author: faculty._id },
      { classID: faculty.classTeacherTo }
    ];
  }

  const updates = await Update.find(filter)
    .populate("classID", "name")
    .populate("author", "teachername username");

  res.status(200).json({ status: successMsg, data: updates });
});

