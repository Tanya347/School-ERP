import mongoose from "mongoose"; 
import validator from "validator";

const AttendanceSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: [true, "Attendance date is required"],
      validate: {
        validator: function (v) {
          return v instanceof Date && !isNaN(v); // Ensures the value is a valid date
        },
        message: "Invalid date format",
      },
    },
    present: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        validate: {
          validator: function (v) {
            return mongoose.isValidObjectId(v); // Ensures valid MongoDB ObjectId for each student
          },
          message: "Invalid student ID in present array",
        },
      },
    ],
    absent: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        validate: {
          validator: function (v) {
            return mongoose.isValidObjectId(v); // Ensures valid MongoDB ObjectId for each student
          },
          message: "Invalid student ID in absent array",
        },
      },
    ],
    classid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: [true, "Class ID is required"],
      validate: {
        validator: function (v) {
          return mongoose.isValidObjectId(v); // Ensures valid MongoDB ObjectId
        },
        message: "Invalid class ID",
      },
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Attendance", AttendanceSchema);
