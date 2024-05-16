import express from "express";
import {
  createCourse,
  deleteCourse,
  getSingleCourse,
  getCourse,
  getCourses,
  updateCourse,
} from "../controllers/course.js";

const router = express.Router();

router.post("/", createCourse);
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);
router.get("/:id", getCourse);
router.get("/single/:id", getSingleCourse);
router.get("/", getCourses);

export default router;
