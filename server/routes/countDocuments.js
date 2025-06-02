import express from "express"
import Class from "../models/Class.js"
import Course from "../models/Course.js"
import Faculty from "../models/Faculty.js";
import Student from "../models/Student.js";
import { protect } from "../controllers/auth.js";
const router = express.Router();

  async function getDocumentCount(model, schoolId) {
    try {
      const count = await model.countDocuments({ schoolID: schoolId });
      return count;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // Controller to get counts for a specific school
  const getCounts = async (req, res, next) => {
    try {
      const schoolId = req.user.schoolID;

      const classCount = await getDocumentCount(Class, schoolId);
      const subjectCount = await getDocumentCount(Course, schoolId);
      const teacherCount = await getDocumentCount(Faculty, schoolId);
      const studentCount = await getDocumentCount(Student, schoolId);

      res.status(200).json({
        data: {
          class: classCount,
          subject: subjectCount,
          teacher: teacherCount,
          student: studentCount,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch counts" });
    }
  };

  router.get("/getAllCount", protect(), getCounts)

  export default router