import Update from "../models/Update.js";

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
        const update = await Update.findById(req.params.id);
        res.status(200).json(update);
    } catch (err) {
        next(err);
    }
};

export const getUpdates = async (req, res, next) => {
    try {
        const updates = await Update.find();
        res.status(200).json(updates);
    } catch (err) {
        next(err)
    }
}