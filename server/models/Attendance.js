import mongoose from "mongoose"; 

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
    classID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
    },
    schoolID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School'
    },
    sessionID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session'
    }
  },
  { timestamps: true }
);

AttendanceSchema.index(
  { date: 1, classID: 1, sessionID: 1, schoolID: 1 },
  { unique: true }
);

export default mongoose.model("Attendance", AttendanceSchema);
