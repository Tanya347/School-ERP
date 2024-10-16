import mongoose from "mongoose";
import Update from "../models/Update.js";
import Faculty from "../models/Faculty.js";

export const createUpdate = async (req, res, next) => {

    const newUpdate = new Update(req.body);
    try {
        const savedUpdate = await newUpdate.save();
        res.status(200).json(savedUpdate);
    } catch (err) {
        next(err);
    }
};

export const updateUpdate = async (req, res, next) => {
    try {
        const update = await Update.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(update);
    } catch (err) {
        next(err);
    }
};

export const deleteUpdate = async (req, res, next) => {
    try {
        await Update.findByIdAndDelete(req.params.id);
        res.status(200).json("the Update has been deleted");
    } catch (err) {
        next(err);
    }
};

export const getUpdate = async (req, res, next) => {
    try {
        const update = await Update.findById(req.params.id).populate("class", "name");
        res.status(200).json(update);
    } catch (err) {
        next(err);
    }
};

export const getUpdates = async (req, res, next) => {
    try {
        const updates = await Update.find().populate("class", "name");
        res.status(200).json(updates);
    } catch (err) {
        next(err)
    }
}

export const getStudentUpdates = async (req, res, next) => {
    const classId = mongoose.Types.ObjectId(req.params.id);
    try {
        const updates = await Update.find();

        const filteredUpdates = updates.filter(update => {
            if (update.updateType === "general") {
              return true;
            } else if (update.updateType === "specific") {
              return update.class.equals(classId);
            }
            return false;
        });

        res.status(200).json(filteredUpdates);
    } catch (err) {
        next(err)
    }
}

export const getFacultyUpdates = async(req, res, next) => {
    
    const facultyId = mongoose.Types.ObjectId(req.params.id);
    
    try {
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
                { updateType: 'specific', class: { $in: classesTaught } }
            ]
        });

        res.status(200).json(updates);
    } catch (err) {
        next(err);
    }
}