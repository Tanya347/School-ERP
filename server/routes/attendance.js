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

// router variable

const router = express.Router();

router.post("/", createAttendance)
router.get("/lecturecount/:classid", getLectureCount)
router.get("/dates/:classid", getAttendanceDates)
router.get("/date/:classid/:date", getAttendanceStatusByDate)
router.get("/classperc/:classid", getClassAttendance)
router.get("/studentperc/:studentid/:classid", getStudentAttendance)
router.get("/presentdates/:studentid/:classid", getStudentPresenceDates)
router.get("/absentdates/:studentid/:classid", getStudentAbsenceDates)
router.put("/:id", editAttendance);
router.delete("/single/:id", deleteAttendance);
router.delete("/class/:classid", clearAttendanceByClass);
router.delete("/", clearAllAttendanceRecords);


export default router;