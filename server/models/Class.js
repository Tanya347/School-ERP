import mongoose from "mongoose";
import validator from "validator";

const ClassSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Class name is required"],
        validate: {
          validator: function (v) {
            return validator.isLength(v, { min: 3, max: 10 });
          },
          message: "Event name should be between 3 and 10 characters",
        },
      },
    classNumber: {
        type: Number,
        required: [true, 'Class Number is required'],
          validate: {
            validator: function (v) {
              return v > 0;
            },
          message: 'Class number must be a valid number'
          }
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
    schoolID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School'
    }
}, { timestamps: true })

export default mongoose.model("Class", ClassSchema);