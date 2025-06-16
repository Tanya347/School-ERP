import express from 'express';
import { createMaterial } from "../controllers/material.js"
import { protect } from '../controllers/auth.js';
const router = express.Router();
import upload from '../utils/multer.js';

router.post('/', protect(), upload.single('file'), createMaterial);
export default router;