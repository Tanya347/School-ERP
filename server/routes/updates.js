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
import { protect } from "../controllers/auth.js";

// router variable
const router = express.Router();


router.post("/", protect(), createUpdate);
router.put("/:id", protect(), updateUpdate);
router.delete("/:id", protect(), deleteUpdate);
router.get("/:id", protect(), getUpdate);
router.get("/", getUpdates);
router.get("/student/:id", protect(), getStudentUpdates);
router.get("/faculty/:id", protect(), getFacultyUpdates);



export default router;