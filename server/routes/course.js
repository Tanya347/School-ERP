import express from "express";
import {
  createCourse,
  deleteCourse,
  getCourse,
  getCourses,
  updateCourse,
} from "../controllers/course.js";
import { restrictTo, protect } from "../controllers/auth.js";

const router = express.Router();

router.post("/", protect(), restrictTo("admin"), createCourse);
router.put("/:id", protect(), restrictTo("admin"), updateCourse);
router.delete("/:id", protect(), restrictTo("admin"), deleteCourse);
router.get("/:id", protect(), getCourse);
router.get("/", protect(), getCourses);

export default router;
