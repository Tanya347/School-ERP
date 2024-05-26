import mongoose from "mongoose"; 

// need to make subjects

const AttendanceSchema = new mongoose.Schema({
    date: {
      type: Date,
      required: true
    },
    present: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
    }],
    absent: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
    }],
    classid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true
    }
  },
  
  { timestamps: true }
);


export default mongoose.model("Attendance", AttendanceSchema);