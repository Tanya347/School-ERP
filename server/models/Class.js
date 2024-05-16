import mongoose from "mongoose";

const ClassSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    classNumber: {
        type: Number,
        required: true
    },
    students: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Student',
        },
    ],
    subjects: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Course',
        },
    ],
    teachers: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Faculty',
        },
    ],
}, { timestamps: true })

export default mongoose.model("Class", ClassSchema);