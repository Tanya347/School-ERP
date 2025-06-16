import mongoose from "mongoose";
import validator from "validator";

const MaterialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Material name is required'],
        validate: {
            validator: function(v) {
                return validator.isLength(v, {min: 3, max: 100});
            },
            message: 'Name should be between 3 and 100 characters'
        }
    },
    description: {
        type: String,
        validate: {
            validator: (v) => validator.isLength(v || '', { max: 500 }),
            message: 'Description must be at most 500 characters'
        }
    },
    fileUrl: {
      type: String,
      validate: {
        validator: function (v) {
          return !v || validator.isURL(v); 
        },
        message: 'Invalid URL for profile picture',
      },
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true
    },
    schoolID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true
    },
    sessionID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true
    },
    cloud_id: {
      type: String,
    }},
  { timestamps: true }
);

export default mongoose.model('Material', MaterialSchema);