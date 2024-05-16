import mongoose from "mongoose";

const ClusterSchema = new mongoose.Schema (
    {
        student_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student'
        },
        predicted_cluster: {
            type: Number
        }
    },
    { timestamps: true }
);

export default mongoose.model("Cluster", ClusterSchema);
