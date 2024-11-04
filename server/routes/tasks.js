import express from "express";
import {
  createTask,
  deleteTask,
  getTask,
  getSingleTask,
  updateTask,
  getStudentTasks,
  getFacultyTasks,
} from "../controllers/tasks.js";
import { protect } from "../controllers/auth.js";


const router = express.Router();

router.post("/", protect(), createTask);
router.put("/:id", protect(), updateTask);
router.delete("/:id", protect(), deleteTask);
router.get("/:id", protect(), getTask);
router.get("/single/:id", protect(), getSingleTask);
router.get("/faculty/:id", protect(), getFacultyTasks);
router.get("/student/:id", protect(), getStudentTasks);


export default router;
