import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Session name is required']
        },
        schoolID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'School'
        },
        isActive: {
            type: Boolean,
            default: false
        }
    }
);

export default mongoose.model("School", SessionSchema);