import express from "express";

import {
  registerStudent,
  updateStudent,
  deleteStudent,
  getStudent,
  getStudents,
  getSingleStudent,
  getGenderCount,
  bulkDeleteStudent
} from "../controllers/student.js";

import { restrictTo, protect, updatePassword } from "../controllers/auth.js";
import upload from "../utils/multer.js";
import Student from "../models/Student.js"

const router = express.Router();

router.post("/registerStudent", protect(), restrictTo("admin"), upload.single('file'), registerStudent);
router.put("/:id", protect(), restrictTo("admin", "student"), upload.single('file'), updateStudent);
router.delete("/:id", protect(), restrictTo("admin"), deleteStudent);
router.get("/:id", protect(), getStudent);
router.get("/single/:id", protect(), getSingleStudent);
router.get("/", protect(), getStudents);
router.get('/gender/count', protect(), restrictTo("admin"), getGenderCount);
router.post("/bulk/delete", protect(), restrictTo("admin"), bulkDeleteStudent);
router.patch("/updatePassword/:id", protect(), restrictTo("student"), updatePassword(Student));

export default router;

