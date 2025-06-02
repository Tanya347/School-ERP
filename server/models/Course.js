
import mongoose from "mongoose";
import validator from "validator";

const CourseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Course name is required"],
      validate: {
        validator: function (v) {
          return validator.isLength(v, { min: 3, max: 100 }); // Course name should be between 3 and 100 characters
        },
        message: "Course name must be between 3 and 100 characters",
      },
    },
    subjectCode: {
      type: String,
      required: [true, "Subject code is required"],
      validate: {
        validator: function (v) {
          return validator.matches(v, /^[A-Za-z0-9_-]+$/); // Subject code should contain alphanumeric characters, underscores, or hyphens
        },
        message: "Subject code must contain only letters, numbers, underscores, or hyphens",
      },
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: [true, "Class reference is required"],
    },
    syllabusPicture: {
      type: String,
      validate: {
        validator: function (v) {
          return !v || validator.isURL(v, { require_protocol: true }); // Validates URL if syllabusPicture is provided
        },
        message: "Syllabus picture must be a valid URL",
      },
    },
    cloud_id: {
      type: String,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
      default: null,
    },
    marksAdded: {
      type: Boolean,
      default: false,
    },
    schoolID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School'
    }
  },
  { timestamps: true }
);

export default mongoose.model("Course", CourseSchema);
