import express from 'express';
import {
    createSession
} from "../controllers/session.js";
import { protect, restrictTo } from "../controllers/auth.js";
const router = express.Router();

// router.post("/", protect(), restrictTo("admin"), createSession);
router.post("/", protect(), restrictTo("admin"), createSession)

export default router;