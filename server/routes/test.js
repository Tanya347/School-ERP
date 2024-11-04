import express from "express";
import {
  createTest,
  deleteTest,
  getTest,
  getFacultyTests,
  getStudentTests,
  getSingleTest,
  updateTest,
  getMarksOfOneStudent,
  getMarksOfAllStudents,
  clearMarksOfTest,
  addEditMarks,
} from "../controllers/test.js";
import { protect } from "../controllers/auth.js";


const router = express.Router();

router.post("/", protect(), createTest);
router.delete("/:id", protect(), deleteTest);
router.get("/faculty/:id", protect(), getFacultyTests);
router.get("/student/:id", protect(), getStudentTests);
router.get("/:id", protect(), getTest);
router.put("/:id", protect(), updateTest);
router.get("/single/:id", protect(), getSingleTest);
router.put("/addMarks/:testid", protect(), addEditMarks);
router.get("/singlemarks/:testid/:studentid", protect(), getMarksOfOneStudent)
router.get("/allmarks/:testid", protect(), getMarksOfAllStudents)
router.delete('/marks/:testid', protect(), clearMarksOfTest)

export default router;
