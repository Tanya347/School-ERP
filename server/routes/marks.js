import express from "express";

import {
    enterMarksForSubject,
    getMarksOfClass,
    getMarksOfStudent,
    getMarksOfSubject,
    clearMarksForClass,
    clearMarksForSubject,
    getStudentMarksHistory
} from "../controllers/marks.js"

import { protect } from "../controllers/auth.js";

const router = express.Router();

router.put('/:subjectId', protect(), enterMarksForSubject);
router.get('/single/:studentId', protect(), getMarksOfStudent);
router.get('/subject/:subjectId', protect(), getMarksOfSubject);
router.get('/class/:classId', protect(), getMarksOfClass);
router.delete('/subject/:subjectId', protect(), clearMarksForSubject);
router.delete('/class/:classId', protect(), clearMarksForClass);
router.get('/history/:studentId', getStudentMarksHistory)

export default router;
