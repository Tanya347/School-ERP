import express from "express";
import {
  registerStudent,
  loginStudent,
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

const router = express.Router();

router.post("/registerStudent", registerStudent);
router.post("/loginStudent", loginStudent);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);
router.get("/:id", getStudent);
router.get("/single/:id", getSingleStudent);
router.get("/", getStudents);
router.put('/marks/:subjectId', enterMarksForSubject);
router.get('/marks/single/:studentid', getMarksOfStudent);
router.get('/marks/subject/:subjectid', getMarksOfSubject);
router.get('/marks/class/:classid', getMarksOfClass);
router.delete('/marks/subject/:subjectid', clearMarksForSubject);
router.delete('/marks/class/:classid', clearMarksForClass)

export default router;

