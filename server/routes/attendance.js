import express from "express"

import {
    clearAllAttendanceRecords,
    clearAttendanceByClass,
    createAttendance,
    deleteAttendance,
    getAttendanceDates,
    getAttendanceStatusByDate,
    getClassAttendance,
    getLectureCount,
    getStudentAbsenceDates,
    getStudentAttendance,
    getStudentPresenceDates
} from "../controllers/attendance.js";

import { isOwner, restrictTo, protect } from "../controllers/auth.js";
import Attendance from "../models/Attendance.js";
import { roles } from "../utils/constants.js";

// router variable

const router = express.Router();

router.post("/", protect(), restrictTo(roles.faculty), createAttendance)
router.get("/lecturecount/:classId", protect(), getLectureCount)
router.get("/dates/:classid", protect(), getAttendanceDates)
router.get("/date/:classId/:date", protect(), getAttendanceStatusByDate)
router.get("/classperc/:classId", protect(), getClassAttendance)
router.get("/studentperc/:studentid/:classId", protect(), getStudentAttendance)
router.get("/presentdates/:studentid/:classId", protect(), getStudentPresenceDates)
router.get("/absentdates/:studentid/:classId", protect(), getStudentAbsenceDates)
router.delete("/single/:id", protect(), isOwner(Attendance), restrictTo(roles.faculty), deleteAttendance);
router.delete("/class/:classId", protect(), restrictTo(roles.faculty), clearAttendanceByClass);
router.delete("/", protect(), restrictTo(roles.admin, roles.faculty), clearAllAttendanceRecords);


export default router;