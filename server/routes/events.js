import express from "express"
import {
    createEvent,
    deleteEvent,
    getEvent,
    getEvents,
    updateEvent,
} from "../controllers/events.js";
import { protect } from "../controllers/auth.js";
// router variable

const router = express.Router();

router.post("/", protect(), createEvent);
router.put("/:id", protect(), updateEvent);
router.delete("/:id", protect(), deleteEvent);
router.get("/:id", protect(), getEvent);
router.get("/", protect(), getEvents);

export default router;