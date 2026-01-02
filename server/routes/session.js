import express from 'express';

import {
    createSession,
    getSession
} from "../controllers/session.js";

import { protect, restrictTo } from "../controllers/auth.js";

const router = express.Router();

// router.post("/", protect(), restrictTo("admin"), createSession);
router.post("/", protect(), restrictTo("admin"), createSession)
router.get("/:schoolId", protect(), getSession)
export default router;