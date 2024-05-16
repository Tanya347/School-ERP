import express from "express"
import {
    createEvent,
    deleteEvent,
    getEvent,
    getEvents,
    updateEvent,
} from "../controllers/events.js";
import { verifyUser} from "../utils/verifyToken.js";
// router variable

const router = express.Router();

router.post("/", createEvent);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);
router.get("/:id", getEvent);
router.get("/", getEvents);

export default router;