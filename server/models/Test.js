import mongoose from "mongoose"

const TestSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        subject: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        },
        syllabus: {
            type: String,
            required: true
        },
        duration: {
            type: Number,
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Faculty'
        },
        sclass: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Class'
        },
        marks: [
            {
                student_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Student',
                },
                value: {
                    type: Number,
                    default: 0
                },
            }
        ]
    }, {
        timestamps: true
    }
);

export default mongoose.model("Test", TestSchema)