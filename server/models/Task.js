import mongoose from "mongoose";
import validator from "validator";

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      validate: {
        validator: function (v) {
          return validator.isLength(v, { min: 5, max: 100 }); 
        },
        message: "Title should be between 5 and 100 characters",
      },
    },
    desc: {
      type: String,
      required: [true, "Description is required"],
      validate: {
        validator: function (v) {
          return validator.isLength(v, { min: 10, max: 500 }); 
        },
        message: "Description should be between 10 and 500 characters",
      },
    },
    deadline: {
      type: Date,
      required: [true, "Deadline is required"],
      validate: {
        validator: function (v) {
          return v > new Date(); 
        },
        message: "Deadline must be a future date",
      },
    },
    sclass: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: [true, "Class is required"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
      required: [true, "Author is required"],
    },
    schoolID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School'
    }
  },
  { timestamps: true }
);

export default mongoose.model("Task", TaskSchema);
