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
    classID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: [function() { return this.updateType === 'specific'; }, 'Class is required when updateType is specific']
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
        ref: 'Session'
    },
    expiresAt: {
        type: Date,
        default: () => {
        const now = new Date();
        now.setMonth(now.getMonth() + 3);
        return now;
        }
    }
}, { timestamps: true })

export default mongoose.model("Update", UpdateSchema);