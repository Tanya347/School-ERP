import express from 'express';

import {
    createMaterial,
    editMaterial,
    getMaterials,
    deleteMaterial,
    getMaterial,
    bulkDeleteMaterial
} from "../controllers/material.js"

import { protect } from '../controllers/auth.js';
import upload from '../utils/multer.js';
import { sessionMiddleware } from '../utils/sessionMiddleware.js';

const router = express.Router();

router.post('/', protect(), sessionMiddleware, upload.single('file'), createMaterial);
router.put('/:id', protect(), upload.single('file'), editMaterial);
router.get('/', protect(), sessionMiddleware, getMaterials);
router.delete('/:id', protect(), sessionMiddleware, deleteMaterial);
router.get('/:id', protect(), getMaterial);
router.post('/bulk/delete', protect(), sessionMiddleware, bulkDeleteMaterial);
export default router;