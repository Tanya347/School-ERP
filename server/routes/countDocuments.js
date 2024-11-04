import express from "express"
import Class from "../models/Class.js"
import Course from "../models/Course.js"
import Faculty from "../models/Faculty.js";
import Student from "../models/Student.js";
const router = express.Router();

async function getDocumentCount(model) {
    try {
      const count = await model.countDocuments({});
      return count;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  const getCounts = async(req, res, next) => {
    try {
      const classCount = await getDocumentCount(Class);
      const subjectCount = await getDocumentCount(Course);
      const teacherCount = await getDocumentCount(Faculty);
      const studentCount = await getDocumentCount(Student);
  
      res.status(200).json({
        data: {
          class: classCount,
        subject: subjectCount,
        teacher: teacherCount,
        student: studentCount
        }
      })
    } catch (error) {
      console.error(error);
    }
  }

  router.get("/getAllCount", getCounts)

  export default router