import mongoose  from "mongoose";

const MarksSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  sessionID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Session",
    required: true,
  },
  schoolID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
    required: true,
  },
  marksObtained: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  status: {
    type: String,
    enum: ["pending", "evaluated", "published"],
    default: "pending",
  }
}, { timestamps: true });

export default mongoose.model("Marks", MarksSchema);
