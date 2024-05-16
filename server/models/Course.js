import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        subjectCode: {
            type: String,
            required: true
        },
        class: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Class',
            required: true
        }, 
        syllabusPicture: {
            type: String,
        },
        cloud_id: {
            type: String,
        },
        teacher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Faculty',
            default: null
        },
        sessions: {
            type: Number, 
        }
    }
);

export default mongoose.model("Course", CourseSchema);