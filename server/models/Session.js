import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Session name is required']
        },
        schoolID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'School',
            required: true
        },
        startYear: {
            type: Number,
            required: true,
        },
        endYear: {
            type: Number,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: false
        },
    }
);

SessionSchema.index(
  { schoolID: 1, isActive: 1 },
  { unique: true, partialFilterExpression: { isActive: true } }
);

SessionSchema.index(
  { schoolID: 1, startYear: 1, endYear: 1 },
  { unique: true }
);

// SessionSchema.pre("validate", function(next) {
//   if (!this.name && this.startYear && this.endYear) {
//     this.name = `${this.startYear}-${this.endYear}`;
//   }
//   next();
// });

export default mongoose.model("Session", SessionSchema);