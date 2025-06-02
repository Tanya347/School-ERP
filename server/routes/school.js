import express from "express";
import {
    createSchool,
    getSchoolInfo,
    editSchoolInfo
} from "../controllers/school.js"
import { protect } from "../controllers/auth.js";

const router = express.Router();

router.post("/", createSchool);
router.get("/:id", protect(), getSchoolInfo);
router.put("/:id", protect(), editSchoolInfo);

export default router;