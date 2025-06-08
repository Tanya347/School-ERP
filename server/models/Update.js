import mongoose from "mongoose";
import validator from "validator";

const UpdateSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        validate: {
            validator: function(v) {
                return validator.isLength(v, {min: 5, max:50});
            },
            message: 'Title should be between 5 and 50 characters'
        }

    },
    desc: {
        type: String,
        required: [true, 'Description is required'],
        validate: {
            validator: function(v) {
                return validator.isLength(v, {min: 5, max:500});
            },
            message: 'Description should be between 5 and 500 characters'
        }
    },
    updateType: {
        type: String,
        required: [true, 'Type is required. Please select the Update type.'],
        enum: {
            values: ['general', 'specific'],
            message: 'Type must be either "general" or "specific"'
        },
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class'
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Faculty'
    },
    schoolID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School'
    },
    sessionID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School'
    }

}, { timestamps: true })

export default mongoose.model("Update", UpdateSchema);