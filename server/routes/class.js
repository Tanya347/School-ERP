import express from "express";
import {
  createClass,
  deleteClass,
  getClassDetails,
  getClasses,
  updateClass,
  getClassesWithSubjects
} from "../controllers/class.js";

const router = express.Router();

router.post("/", createClass);
router.put("/:id", updateClass);
router.delete("/:id", deleteClass);
router.get("/courses", getClassesWithSubjects)
router.get("/:id", getClassDetails);
router.get("/", getClasses);

export default router;
