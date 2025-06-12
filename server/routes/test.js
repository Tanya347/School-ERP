import express from "express";
import {
  createTest,
  deleteTest,
  getTest,
  updateTest,
  getMarksOfOneStudent,
  getMarksOfAllStudents,
  clearMarksOfTest,
  addEditMarks,
  getTests,
  completeTest,
  cancelTest
} from "../controllers/test.js";
import { protect } from "../controllers/auth.js";


const router = express.Router();

router.post("/", protect(), createTest);
router.delete("/:id", protect(), deleteTest);
router.get("/", protect(), getTests);
router.get("/:id", protect(), getTest);
router.put("/:id", protect(), updateTest);
router.put("/addMarks/:testid", protect(), addEditMarks);
router.get("/singlemarks/:testid/:studentid", protect(), getMarksOfOneStudent)
router.get("/allmarks/:testid", protect(), getMarksOfAllStudents)
router.delete('/marks/:testid', protect(), clearMarksOfTest)
router.put('/complete/:testid', protect(), completeTest);
router.put('/cancel/:testid', protect(), cancelTest);

export default router;
