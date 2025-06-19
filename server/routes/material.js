import express from 'express';
import {
    createMaterial,
    editMaterial,
    getMaterials,
    deleteMaterial,
    getMaterial
} from "../controllers/material.js"
import { protect } from '../controllers/auth.js';
const router = express.Router();
import upload from '../utils/multer.js';

router.post('/', protect(), upload.single('file'), createMaterial);
router.put('/:id', protect(), upload.single('file'), editMaterial);
router.get('/', protect(), getMaterials);
router.delete('/:id', protect(), deleteMaterial);
router.get('/:id', protect(), getMaterial);
export default router;