import express from "express";
import {
  registerFaculty,
  loginFaculty,
  updateFaculty,
  deleteFaculty,
  getFaculty,
  getFacultys,
  getFacultyClasses,
  getFacultyCourses,
  AddNewCourse,
} from "../controllers/faculty.js";

const router = express.Router();

router.post("/registerFaculty", registerFaculty);
router.post("/loginFaculty", loginFaculty);
router.put("/:id", updateFaculty);
router.delete("/:id", deleteFaculty);
router.get("/:id", getFaculty);
router.get("/", getFacultys);
router.get("/classes/:id", getFacultyClasses);
router.get("/courses/:id", getFacultyCourses);
router.patch('/addCourse/:facId/:classId/:courseId', AddNewCourse);

export default router;

