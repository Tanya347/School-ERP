import mongoose from "mongoose";
import validator from "validator";

const QuerySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }, 
    author: {
        type: String
    },
    queryTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Faculty'
    },
    teacher: {
        type: String
    },
    response: {
        type: String
    },
    schoolID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School'
    },
    sessionID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Session'
    }
}, { timestamps: true })

export default mongoose.model("Query", QuerySchema);