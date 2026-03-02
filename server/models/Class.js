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
    minAge: {
      type: Number,
      required: [true, 'Minimum age is required'],
        validate: {
          validator: function (v) {
            return v > 0;
          },
        message: 'Minimum age must be a valid number'
      }
    },
    maxAge: {
      type: Number,
      required: [true, 'Maximum age is required'],
        validate: {
          validator: function (v) {
            return v > 0;
          },
        message: 'Maximum age must be a valid number'
      }
    },
    students: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    }],
    subjects: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject'
    }],
    schoolID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School'
    },
    classTeacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faculty'
    }
}, { timestamps: true })

export default mongoose.model("Class", ClassSchema);