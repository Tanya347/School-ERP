import express from "express";
import {
  createTask,
  deleteTask,
  getTask,
  updateTask,
  getTasks,
} from "../controllers/tasks.js";
import { protect } from "../controllers/auth.js";


const router = express.Router();

router.post("/", protect(), createTask);
router.put("/:id", protect(), updateTask);
router.delete("/:id", protect(), deleteTask);
router.get("/:id", protect(), getTask);
router.get("/", protect(), getTasks);


export default router;
