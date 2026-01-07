import Update from "../models/Update.js";
import Faculty from "../models/Faculty.js";

import { catchAsync } from "../utils/catchAsync.js";
import { getActiveSession } from "./session.js";
import { successMsg } from "../utils/constants.js";

export const createUpdate = catchAsync(async (req, res, next) => {
    req.body.schoolID = req.user.schoolID;
    const activeSession = await getActiveSession(req.user);
    req.body.sessionID = activeSession._id;
    const newUpdate = new Update(req.body);
    const savedUpdate = await newUpdate.save();
    res.status(200).json({
        status: successMsg,
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
        status: successMsg,
        message: 'Update edited successfully!',
        data: update
    });
});

export const deleteUpdate = catchAsync(async (req, res, next) => {
    await Update.findByIdAndDelete(req.params.id);
    res.status(200).json({
        status: successMsg,
        message: 'Update deleted successfully!',
    });
});

export const bulkDeleteUpdate = catchAsync(async (req, res, next) => {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return next(new AppError("No IDs provided for deletion", 400));
    }
    await Update.deleteMany({ _id: { $in: ids } });
    res.status(200).json({
        status: successMsg,
        message: `${ids.length} updates deleted successfully!`,
    });
});

export const getUpdate = catchAsync(async (req, res, next) => {
    const update = await Update.findById(req.params.id).populate("class", "name");
    res.status(200).json({
        status: successMsg,
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
        if (!faculty) next(new AppError('Faculty not found', 404));

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
        ...update.toObject()
    }));

    res.status(200).json({
        status: successMsg,
        data: enrichedUpdates
    });
});
