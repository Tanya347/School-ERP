import express from "express";
import {
  createTimetablee,
  deleteTimetablee,
  getTimetablee,
  getTimetableById,
  updateTimetablee,
} from "../controllers/timetable.js";

const router = express.Router();

router.post("/", createTimetablee);
router.put("/:id", updateTimetablee);
router.delete("/:id", deleteTimetablee);
router.get("/:id", getTimetableById);
router.get("/", getTimetablee);

export default router;