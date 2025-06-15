import express from 'express';
import { createMaterial } from "../controllers/material.js"
import { protect } from '../controllers/auth.js';
const router = express.Router();

router.post('/', protect(), createMaterial);
export default router;