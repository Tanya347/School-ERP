import express from "express";
import {
  updateFaculty,
  deleteFaculty,
  getFaculty,
  getFacultys,
  getFacultyClasses,
  getFacultyCourses,
  registerFaculty,
  AddNewCourse,
  bulkDeleteFaculty
} from "../controllers/faculty.js";
import upload from "../utils/multer.js";
import { restrictTo, protect } from "../controllers/auth.js";


const router = express.Router();

router.post("/registerFaculty", protect(), restrictTo("admin"), upload.single('file'), registerFaculty);
router.put("/:id", protect(), restrictTo("admin"), updateFaculty);
router.delete("/:id", protect(), restrictTo("admin"), deleteFaculty);
router.get("/:id", protect(), getFaculty);
router.get("/", protect(), getFacultys);
router.get("/classes/:id", protect(), getFacultyClasses);
router.get("/courses/:id", protect(), getFacultyCourses);
router.patch('/addCourse/:facId/:classId/:courseId', protect(), restrictTo("admin"), AddNewCourse);
router.post("/bulk/delete", protect(), restrictTo("admin"), bulkDeleteFaculty);

export default router;

