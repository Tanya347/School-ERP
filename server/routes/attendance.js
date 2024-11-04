import express from "express"
import {
    clearAllAttendanceRecords,
    clearAttendanceByClass,
    createAttendance,
    deleteAttendance,
    editAttendance,
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

// router variable

const router = express.Router();

router.post("/", protect(), restrictTo("faculty"), createAttendance)
router.get("/lecturecount/:classid", protect(), getLectureCount)
router.get("/dates/:classid", protect(), getAttendanceDates)
router.get("/date/:classid/:date", protect(), getAttendanceStatusByDate)
router.get("/classperc/:classid", protect(), getClassAttendance)
router.get("/studentperc/:studentid/:classid", protect(), getStudentAttendance)
router.get("/presentdates/:studentid/:classid", protect(), getStudentPresenceDates)
router.get("/absentdates/:studentid/:classid", protect(), getStudentAbsenceDates)
router.put("/:id", protect(), isOwner(Attendance), restrictTo("faculty"), editAttendance);
router.delete("/single/:id", protect(), isOwner(Attendance), restrictTo("faculty"), deleteAttendance);
router.delete("/class/:classid", protect(), isOwner(Attendance), restrictTo("faculty"), clearAttendanceByClass);
router.delete("/", protect(), restrictTo("admin", "faculty"), clearAllAttendanceRecords);


export default router;