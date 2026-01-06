import express from "express";

import {
    createSchool,
    getSchoolInfo,
    editSchoolInfo
} from "../controllers/school.js"

import upload from "../utils/multer.js";
import { protect, restrictTo } from "../controllers/auth.js";
import { roles } from "../utils/constants.js";

const router = express.Router();

router.post("/", upload.single('file'), createSchool);
router.get("/", protect(), getSchoolInfo);
router.put("/:id", protect(), restrictTo(roles.admin), upload.single('file'), editSchoolInfo);

export default router;