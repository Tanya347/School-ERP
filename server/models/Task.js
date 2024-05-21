import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    desc: {
      type: String,
      required: true
    },
    deadline: {
      type: Date,
      required: true
    },
    sclass: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faculty'
    },
  },
  { timestamps: true }
);

export default mongoose.model("Task", TaskSchema);
