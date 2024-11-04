import express from "express";
import {
  createClass,
  deleteClass,
  getClassDetails,
  getClasses,
  updateClass,
  getClassesWithSubjects,
  getClassStudents,
  getClassSubjects
} from "../controllers/class.js";
import { protect, restrictTo } from "../controllers/auth.js";

const router = express.Router();

router.post("/", protect(), restrictTo("admin"), createClass);
router.put("/:id", protect(), restrictTo("admin"), updateClass);
router.delete("/:id", protect(), restrictTo("admin"), deleteClass);
router.get("/courses", protect(), restrictTo("admin"), getClassesWithSubjects)
router.get("/course/:id", protect(), getClassSubjects)
router.get("/details/:id", protect(), getClassDetails);
router.get("/", protect(), restrictTo("admin"), getClasses);
router.get("/students/:id", protect(), getClassStudents)

export default router;
