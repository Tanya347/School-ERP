import mongoose from "mongoose";

const UpdateSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "New"
    },
    updateType: {
        type: String,
        required: true,
        default: "general"
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class'
    }

}, { timestamps: true })

export default mongoose.model("Update", UpdateSchema);