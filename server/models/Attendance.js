import mongoose from "mongoose"; 

// need to make subjects

const AttendanceSchema = new mongoose.Schema({
    date: {
      type: Date,
      required: true
    },
    present: [{
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    }],
    absent: [{
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    }],
    classid: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: true
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true
    }
  },
  
  { timestamps: true }
);


export default mongoose.model("Attendance", AttendanceSchema);