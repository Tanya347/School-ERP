import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  faculty: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Faculty'
  }, 
  standard: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Course"
  }, 
  topic: {
    type: String, 
    required: false, 
  },
  difficulty: {
    type: Number,
    required: true,
  },
  feedback: [
    {
        rate: {
            type: Number, 
            required: false, 
        }, 
        stu_id: {
            type: mongoose.Schema.Types.ObjectId, 
            required: false
        }
    }
  ]
});

export default mongoose.model("Video", videoSchema);
