import express from "express";

import {
    createSlot,
    getSlots,
    updateSlot,
    deleteSlotsForClass,
    bulkCreateSlots
} from "../controllers/timetable.js"

import { protect, restrictTo } from "../controllers/auth.js";
import { roles } from "../utils/constants.js";

const router = express.Router();

router.post("/", protect(), restrictTo(roles.admin), createSlot);
router.get("/",  protect(), getSlots);
router.put("/:id", protect(), restrictTo(roles.admin), updateSlot);
router.delete("/:id", protect(), restrictTo(roles.admin), deleteSlotsForClass);
router.post('/bulkCreate', protect(), restrictTo(roles.admin), bulkCreateSlots);

export default router;
