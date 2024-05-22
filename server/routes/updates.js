import express from "express"
import {
    createUpdate,
    deleteUpdate,
    getUpdate,
    getStudentUpdates,
    getFacultyUpdates,
    getUpdates,
    updateUpdate,
} from "../controllers/updates.js";
import { verifyUser } from "../utils/verifyToken.js";
// router variable
const router = express.Router();


router.post("/", createUpdate);
router.put("/:id", updateUpdate);
router.delete("/:id", deleteUpdate);
router.get("/:id", getUpdate);
router.get("/", getUpdates);
router.get("/student/:id", getStudentUpdates);
router.get("/faculty/:id", getFacultyUpdates);



export default router;