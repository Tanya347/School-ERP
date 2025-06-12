import Update from "../models/Update.js";
import Faculty from "../models/Faculty.js";
import { catchAsync } from "../utils/catchAsync.js";
import { getActiveSession } from "./session.js";

export const createUpdate = catchAsync(async (req, res, next) => {
    req.body.schoolID = req.user.schoolID;
    const activeSession = await getActiveSession(req.user);
    req.body.sessionID = activeSession._id;
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
    const { classId, facultyId } = req.query;
    let updates = [];

    const now = new Date();
    const baseFilter = { schoolID: req.user.schoolID, expiresAt: { $gt: now } };

    if (facultyId) {
        const faculty = await Faculty.findById(facultyId).populate('classesTaught');
        if (!faculty) return res.status(404).json({ message: "Faculty not found" });

        const classesTaught = faculty.classesTaught.map(c => c._id);

        updates = await Update.find({
            $or: [
                { updateType: 'general' },
                { updateType: 'specific', class: { $in: classesTaught } },
                { author: facultyId }
            ],
            ...baseFilter
        }).populate("class", "name");
    }

    else if (classId) {
        const filter = {
        $or: [
            { updateType: 'general' },
            { updateType: 'specific', class: classId }
        ],
        ...baseFilter
        };

        updates = await Update.find(filter).populate("class", "name");
    }

    else {
        updates = await Update.find({
            schoolID: req.user.schoolID
        }).populate("class", "name");
    }

    const enrichedUpdates = updates.map(update => ({
        ...update.toObject(),
        isRead: update.readBy.some(read => read.user.toString() === req.user._id.toString())
    }));

    res.status(200).json({
        status: "success",
        data: enrichedUpdates
    });
});

export const markUpdateAsRead = catchAsync(async (req, res, next) => {
    const { userId, userModel } = req.body;
    const update = await Update.findById(req.params.id);

    if (!update) {
        return res.status(404).json({ message: "Update not found" });
    }

    // Check if the user has already read the update
    const alreadyRead = update.readBy.some(
        (read) => read.user.toString() === userId && read.userModel === userModel
    );

    if (alreadyRead) {
        return res.status(400).json({ message: "Update already marked as read" });
    }

    // Add the user to the readBy array
    update.readBy.push({ user: userId, userModel });
    await update.save();

    res.status(200).json({
        status: "success",
        message: 'Update marked as read successfully!',
        data: update
    });
});