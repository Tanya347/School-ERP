import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    studentSubject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    question1: {
      type: Number,
      min: 0,
      max: 10,
      required: true,
    },
    question2: {
      type: Number,
      min: 0,
      max: 10,
      required: true,
    },
    question3: {
      type: Number,
      min: 0,
      max: 10,
      required: true,
    },
    question4: {
      type: Number,
      min: 0,
      max: 10,
      required: true,
    },
    question5: {
      type: Number,
      min: 0,
      max: 10,
      required: true,
    }
  },
  { timestamps: true }
);

export default mongoose.model('Feedback', FeedbackSchema);
