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
  bulkDeleteFaculty,
  removeCourseFromFaculty,
  changeCourseFaculty
} from "../controllers/faculty.js";

import upload from "../utils/multer.js";
import { restrictTo, protect, updatePassword } from "../controllers/auth.js";
import Faculty from "../models/Faculty.js";
import { roles } from "../utils/constants.js";

const router = express.Router();

router.post("/registerFaculty", protect(), restrictTo(roles.admin), upload.single('file'), registerFaculty);
router.put("/:id", protect(), restrictTo(roles.admin), upload.single('file'), updateFaculty);
router.delete("/:id", protect(), restrictTo(roles.admin), deleteFaculty);
router.get("/:id", protect(), getFaculty);
router.get("/", protect(), getFacultys);
router.get("/classes/:id", protect(), getFacultyClasses);
router.get("/courses/:id", protect(), getFacultyCourses);
router.patch('/addCourse/:facId/:classId/:courseId', protect(), restrictTo(roles.admin), AddNewCourse);
router.patch("/removeCourse/:facId/:classId/:courseId", protect(), restrictTo(roles.admin), removeCourseFromFaculty);
router.patch("/changeCourseFaculty/:courseId/:newFacId/:classId", protect(), restrictTo(roles.admin), changeCourseFaculty);
router.post("/bulk/delete", protect(), restrictTo(roles.admin), bulkDeleteFaculty);
router.patch("/updatePassword/:id", protect(), restrictTo(roles.faculty), updatePassword(Faculty));

export default router;

