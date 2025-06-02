import mongoose from "mongoose";
import validator from "validator";

const SessionSchema = new mongoose.Schema(
    {
        name: {

        },
        startDate: {

        },
        endDate: {

        },
        schoolId: {

        },
        isActive: {

        }
    }
);

export default mongoose.model("School", SessionSchema);