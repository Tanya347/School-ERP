import express from "express";
import {
  registerStudent,
  updateStudent,
  deleteStudent,
  getStudent,
  getStudents,
  getSingleStudent,
  getMarksOfClass,
  getMarksOfStudent,
  getMarksOfSubject,
  enterMarksForSubject,
  clearMarksForSubject,
  clearMarksForClass
} from "../controllers/student.js";
import { restrictTo, protect } from "../controllers/auth.js";

const router = express.Router();

router.post("/registerStudent", protect(), restrictTo("admin"), registerStudent);
router.put("/:id", protect(), restrictTo("admin", "student"), updateStudent);
router.delete("/:id", protect(), restrictTo("admin"), deleteStudent);
router.get("/:id", protect(), getStudent);
router.get("/single/:id", protect(), getSingleStudent);
router.get("/", protect(), getStudents);
router.put('/marks/:subjectId', protect(), enterMarksForSubject);
router.get('/marks/single/:studentid', protect(), getMarksOfStudent);
router.get('/marks/subject/:subjectid', protect(), getMarksOfSubject);
router.get('/marks/class/:classid', protect(), getMarksOfClass);
router.delete('/marks/subject/:subjectid', protect(), clearMarksForSubject);
router.delete('/marks/class/:classid', protect(), clearMarksForClass)

export default router;

