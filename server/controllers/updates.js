import Update from "../models/Update.js";
import Faculty from "../models/Faculty.js";
import { catchAsync } from "../utils/catchAsync.js";

export const createUpdate = catchAsync(async (req, res, next) => {
    req.body.schoolID = req.user.schoolID;
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
            ...({ schoolID: req.user.schoolID })
        }).populate("class", "name");
    }

    else if (classId) {
        const filter = {
        $or: [
            { updateType: 'general' },
            { updateType: 'specific', class: classId }
        ],
        ...({ schoolID: req.user.schoolID })
        };

        updates = await Update.find(filter).populate("class", "name");
    }

    else {
        updates = await Update.find({
            schoolID: req.user.schoolID
        }).populate("class", "name");
    }

    res.status(200).json({
        status: "success",
        data: updates
    });
});