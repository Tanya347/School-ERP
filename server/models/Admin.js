import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema (
    {
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        isAdmin: {
            type: Boolean,
            default: true,
        },
        isStudent: {
            type: Boolean,
            default: false
        },
        isFaculty: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

export default mongoose.model("Admin", AdminSchema);
