import express from "express";

import {
  createClass,
  deleteClass,
  getClassDetails,
  getClasses,
  updateClass,
  getClassesWithSubjects,
  getClassStudents,
  getClassSubjects,
  addClassTeacher
} from "../controllers/class.js";

import { protect, restrictTo } from "../controllers/auth.js";
import { roles } from "../utils/constants.js";

const router = express.Router();

router.post("/", protect(), restrictTo(roles.admin), createClass);
router.put("/:id", protect(), restrictTo(roles.admin), updateClass);
router.delete("/:id", protect(), restrictTo(roles.admin), deleteClass);
router.get("/courses", protect(), restrictTo(roles.admin), getClassesWithSubjects)
router.get("/course/:id", protect(), getClassSubjects)
router.get("/details/:id", protect(), getClassDetails);
router.get("/", protect(), restrictTo(roles.admin), getClasses);
router.get("/students/:id", protect(), getClassStudents);
router.put("/classTeacher/:id", protect(), restrictTo(roles.admin), addClassTeacher);

export default router;
