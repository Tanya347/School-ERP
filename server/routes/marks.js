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
router.get('/single/:studentid', protect(), getMarksOfStudent);
router.get('/subject/:subjectid', protect(), getMarksOfSubject);
router.get('/class/:classid', protect(), getMarksOfClass);
router.delete('/subject/:subjectid', protect(), clearMarksForSubject);
router.delete('/class/:classid', protect(), clearMarksForClass);
router.get('history/:schoolId/:studentId', getStudentMarksHistory)

export default router;
