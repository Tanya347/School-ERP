import express from "express";

import {
  createCourse,
  deleteCourse,
  getCourse,
  getCourses,
  updateCourse,
  setExamDatesForClass,
  clearExamDatesForClass,
  getExamDatesForClass
} from "../controllers/course.js";

import upload from "../utils/multer.js";
import { restrictTo, protect } from "../controllers/auth.js";

const router = express.Router();

router.post("/", protect(), restrictTo("admin"), upload.single('file'), createCourse);
router.put("/:id", protect(), restrictTo("admin"), upload.single('file'), updateCourse);
router.delete("/:id", protect(), restrictTo("admin"), deleteCourse);
router.get("/:id", protect(), getCourse);
router.get("/", protect(), getCourses);
router.put("/exam/setdates", protect(), restrictTo("admin"), setExamDatesForClass);
router.delete("/exam/clear/:classId", protect(), restrictTo("admin"), clearExamDatesForClass);
router.get("/exam/:classId", protect(), getExamDatesForClass);
export default router;
