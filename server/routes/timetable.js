import express from "express";
import {
    createSlot,
    getSlots,
    updateSlot,
    deleteSlot,
    bulkCreateSlots
} from "../controllers/timetable.js"
import { protect, restrictTo } from "../controllers/auth.js";

const router = express.Router();

router.post("/", protect(), restrictTo("admin"), createSlot);
router.get("/",  protect(), getSlots);
router.put("/:id", protect(), updateSlot);
router.delete("/:id", protect(), deleteSlot);
router.post('/bulkCreate', protect(), bulkCreateSlots);

export default router;
