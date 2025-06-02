import mongoose from "mongoose";
import validator from "validator";

const TestSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Title is required'],
            validate: {
                validator: function (v) {
                    return validator.isLength(v, { min: 5, max: 50 }); // Check the length of the title
                },
                message: 'Title should be between 5 and 50 characters'
            }
        },
        subject: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: [true, 'Subject is required']
        },
        syllabus: {
            type: String,
            required: [true, 'Syllabus is required'],
            validate: {
                validator: function (v) {
                    return validator.isLength(v, { min: 5, max: 100 }); // Check the length of the syllabus
                },
                message: 'Syllabus should be between 5 and 100 characters'
            }
        },
        duration: {
            type: Number,
            required: [true, 'Duration is required'],
            validate: {
                validator: function (v) {
                    return v > 0; // Ensure duration is a positive number
                },
                message: 'Duration must be a valid number'
            }
        },
        date: {
            type: String,
            required: [true, 'Test date is required'],
            validate: {
                validator: function (v) {
                    return validator.isISO8601(v); // Check if it's a valid date
                },
                message: 'Test date and time must be valid'
            }
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Faculty',
            required: [true, 'Author is required']
        },
        sclass: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Class',
            required: [true, 'Class is required']
        },
        schoolID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'School'
        },
        totalMarks: {
            type: Number,
            required: [true, 'Total marks is required'],
            validate: {
                validator: function (v) {
                    return v > 0; 
                },
                message: 'Total marks must be a valid number'
            }
        },
        marks: [
            {
                student_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Student',
                    required: [true, 'Student ID is required']
                },
                value: {
                    type: Number,
                    required: [true, 'Marks value is required'],
                    validate: {
                        validator: function (v) {
                            return v >= 0; 
                        },
                        message: 'Marks value should be a valid number'
                    },
                    default: 0
                },
                present: {
                    type: Boolean,
                    default: false
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

export default mongoose.model("Test", TestSchema);
