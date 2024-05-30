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

const router = express.Router();

router.post("/", createClass);
router.put("/:id", updateClass);
router.delete("/:id", deleteClass);
router.get("/courses", getClassesWithSubjects)
router.get("/course/:id", getClassSubjects)
router.get("/details/:id", getClassDetails);
router.get("/", getClasses);
router.get("/students/:id", getClassStudents)

export default router;
