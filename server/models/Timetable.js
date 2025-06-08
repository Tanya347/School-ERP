// models/TimetableSlot.js
import mongoose from "mongoose";

const timetableSlotSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    required: true,
  },
  period: {
    type: Number,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Faculty",
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  sclass: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  schoolID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
    required: true,
  },
  sessionID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School'
  }
}, { timestamps: true });

export default mongoose.model("TimetableSlot", timetableSlotSchema);
