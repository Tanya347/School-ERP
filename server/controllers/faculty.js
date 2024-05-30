import Faculty from "../models/Faculty.js";
import Course from "../models/Course.js";
import Class from "../models/Class.js"
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";


export const registerFaculty = async (req, res, next) => {
  try {

    const {email, password,...otherFields} = req.body;
    const em = await Faculty.findOne({ email });
    if (em)
      return res.status(409).send({ message: "User with given email already exists" })


    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const newFaculty = new Faculty({
      ...req.body,
      password: hash,
    });

    await newFaculty.save();

    res.status(200).send(newFaculty);
  } catch (err) {
    next(err);
  }
};


export const loginFaculty = async (req, res, next) => {
  try {
    const user = await Faculty.findOne({ username: req.body.username });
    if (!user) return next(createError(404, "User not found!"));

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect)
      return next(createError(400, "Wrong password or username!"));

    const token = jwt.sign(
      { id: user._id},
      process.env.JWT
    );

    const { password, ...otherDetails } = user._doc;
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      // sending all details except password
      .json({ details: { ...otherDetails } });
  } catch (err) {
    next(err);
  }
};

export const updateFaculty = async (req, res, next) => {
  try {
    const updatedFaculty = await Faculty.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedFaculty);
  } catch (err) {
    next(err);
  }
};

export const deleteFaculty = async (req, res, next) => {
    try {
      await Faculty.findByIdAndDelete(req.params.id);
      res.status(200).json("the Faculty has been deleted");
    } catch (err) {
      next(err);
    }
  };
  
  export const getFaculty = async (req, res, next) => {
    try {
      const faculty = await Faculty.findById(req.params.id).populate('subjectsTaught').populate('classesTaught', 'name');
      res.status(200).json(faculty);
    } catch (err) {
      next(err);
    }
  };
  
  export const getFacultys = async (req, res, next) => {
    try {
      const facultys = await Faculty.find().populate('subjectsTaught');
      
      res.status(200).json(facultys);
    } catch (err) {
      next(err)
    }
  }

  export const getFacultyClasses = async(req, res, next) => {
    try{
      const faculty = await Faculty.findById(req.params.id).populate('classesTaught', 'name')
      
    const classes = faculty.classesTaught.map((sclass) => ({
      _id: sclass._id,
      name: sclass.name,
    }));

    res.status(200).json(classes);
    }
    catch (err){
      next(err)
    }
  }

  export const getFacultyCourses = async(req, res, next) => {
    try{
      const faculty = await Faculty.findById(req.params.id).populate('subjectsTaught', 'name subjectCode class')
      
    const courses = faculty.subjectsTaught.map((course) => ({
      _id: course._id,
      name: course.name,
      sclass: course.class,
      subjectCode: course.subjectCode
    }));

    res.status(200).json(courses);
    }
    catch (err){
      next(err)
    }
  }

  export const AddNewCourse = async(req, res, next) => {
    const facId = req.params.facId;
    const classId = req.params.classId;
    const courseId = req.params.courseId;

    try {
      // Update Faculty model
      await Faculty.updateOne(
        { _id: facId }, // Use an object to specify the filter
        {
          $addToSet: {
            subjectsTaught: courseId,
            classesTaught: classId,
          },
        }
      );

      // Update Class model
      await Class.updateOne(
        { _id: classId },
        {
          $addToSet: {
            teachers: facId,
          },
        }
      );

      // Update Course model
      await Course.updateOne(
        { _id: courseId },
        {
          $set: {
            teacher: facId,
          },
        }
      );

      res.status(200).json({ message: 'Course added successfully.' });
    }
    catch(err) {
      next(err)
    }
  }


