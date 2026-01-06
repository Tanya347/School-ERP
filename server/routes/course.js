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
import { roles } from "../utils/constants.js";

const router = express.Router();

router.post("/", protect(), restrictTo(roles.admin), upload.single('file'), createCourse);
router.put("/:id", protect(), restrictTo(roles.admin), upload.single('file'), updateCourse);
router.delete("/:id", protect(), restrictTo(roles.admin), deleteCourse);
router.get("/:id", protect(), getCourse);
router.get("/", protect(), getCourses);
router.put("/exam/setdates", protect(), restrictTo(roles.admin), setExamDatesForClass);
router.delete("/exam/clear/:classId", protect(), restrictTo(roles.admin), clearExamDatesForClass);
router.get("/exam/:classId", protect(), getExamDatesForClass);
export default router;
