import mongoose from "mongoose";
import Update from "../models/Update.js";
import Faculty from "../models/Faculty.js";
import { catchAsync } from "../utils/catchAsync.js";

export const createUpdate = catchAsync(async (req, res, next) => {
    const newUpdate = new Update(req.body);
    const savedUpdate = await newUpdate.save();
    res.status(200).json({
        status: "success",
        message: 'Update created successfully!',
        data: savedUpdate
    });
});

export const updateUpdate = catchAsync(async (req, res, next) => {
    const update = await Update.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
    );
    res.status(200).json({
        status: "success",
        message: 'Update edited successfully!',
        data: update
    });
});

export const deleteUpdate = catchAsync(async (req, res, next) => {
    await Update.findByIdAndDelete(req.params.id);
    res.status(200).json({
        status: "success",
        message: 'Update deleted successfully!',
    });
});

export const getUpdate = catchAsync(async (req, res, next) => {
    const update = await Update.findById(req.params.id).populate("class", "name");
    res.status(200).json({
        status: "success",
        data: update
    });
});

export const getUpdates = catchAsync(async (req, res, next) => {
    const updates = await Update.find().populate("class", "name");
    res.status(200).json({
        status: "success",
        data: updates
    });
});

export const getStudentUpdates = catchAsync(async (req, res, next) => {
    const classId = mongoose.Types.ObjectId(req.params.id);
    const updates = await Update.find();

    const filteredUpdates = updates.filter(update => {
        if (update.updateType === "general") {
            return true;
        } else if (update.updateType === "specific") {
            return update.class.equals(classId);
        }
        return false;
    });

    res.status(200).json({
        status: "success",
        data: filteredUpdates
    });
});

export const getFacultyUpdates = catchAsync(async(req, res, next) => {
    
    const facultyId = mongoose.Types.ObjectId(req.params.id);
    
    // Fetch the faculty member data
    const faculty = await Faculty.findById(facultyId).populate('classesTaught');

    if (!faculty) {
        return res.status(404).json({ message: "Faculty not found" });
    }

    // Get the classes taught by the faculty member
    const classesTaught = faculty.classesTaught.map(c => c._id);

    // Query the updates
    const updates = await Update.find({
        $or: [
            { updateType: 'general' },
            { updateType: 'specific', class: { $in: classesTaught } },
            { author: facultyId }
        ]
    }).populate("class", "name");;

    res.status(200).json({
        status: "success",
        data: updates
    });
})