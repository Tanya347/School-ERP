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

const router = express.Router();

router.post("/", createTest);
router.delete("/:id", deleteTest);
router.get("/faculty/:id", getFacultyTests);
router.get("/student/:id", getStudentTests);
router.get("/:id", getTest);
router.put("/:id", updateTest);
router.get("/single/:id", getSingleTest);
router.put("/addMarks/:testid", addEditMarks);
router.get("/singlemarks/:testid/:studentid", getMarksOfOneStudent)
router.get("/allmarks/:testid", getMarksOfAllStudents)
router.delete('/marks/:testid', clearMarksOfTest)

export default router;
