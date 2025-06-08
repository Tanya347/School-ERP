import express from "express";
import {
    createSlot,
    getSlots,
    updateSlot,
    deleteSlotsForClass,
    bulkCreateSlots
} from "../controllers/timetable.js"
import { protect, restrictTo } from "../controllers/auth.js";

const router = express.Router();

router.post("/", protect(), restrictTo("admin"), createSlot);
router.get("/",  protect(), getSlots);
router.put("/:id", protect(), restrictTo("admin"), updateSlot);
router.delete("/:id", protect(), restrictTo("admin"), deleteSlotsForClass);
router.post('/bulkCreate', protect(), restrictTo("admin"), bulkCreateSlots);

export default router;
