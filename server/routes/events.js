import express from "express"

import {
    createEvent,
    deleteEvent,
    getEvent,
    getEvents,
    updateEvent,
} from "../controllers/events.js";

import { protect } from "../controllers/auth.js";
import upload from "../utils/multer.js";
import { sessionMiddleware } from "../utils/sessionMiddleware.js";

const router = express.Router();

router.post("/", protect(), sessionMiddleware,  upload.single('file'), createEvent);
router.put("/:id", protect(), upload.single('file'), updateEvent);
router.delete("/:id", protect(), deleteEvent);
router.get("/:id", protect(), getEvent);
router.get("/", protect(), getEvents);

export default router;