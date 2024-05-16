import mongoose from "mongoose";

const FacultySchema = new mongoose.Schema(
  {
    teachername: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    enroll: {
      type: String,
      required: true
    },
    profilePicture: {
      type: String,
    },
    cloud_id: {
      type: String,
    },
    password: {
      type: String,
      required: true
    },
    gender: {
      type: String,
      required: true
    },
    facultyPhone: {
      type: String,
      required: true
    },
    facultyAddress: {
      type: String,
      required: true
    },
    dob: {
      type: String,
      required: true
    },
    joiningYear: {
      type: String,
      required: true
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isStudent: {
      type: Boolean,
      default: false
    },
    isFaculty: {
      type: Boolean,
      default: true
    },
    subjectsTaught: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
      },
    ],
    classesTaught: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Faculty", FacultySchema);