import Student from "../models/Student.js";
import Class from "../models/Class.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";
import Course from "../models/Course.js"; 

export const registerStudent = async (req, res, next) => {
  try {

    const {email, password} = req.body;

    const em = await Student.findOne({ email });
    if (em)
      return res.status(409).send({ message: "User with given email already exists" })


    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const newStudent = new Student({
      ...req.body,
      password: hash,
    });

    try {
      await Class.updateOne(
        { _id: newStudent.class },
        { $addToSet: { students: newStudent._id } }
      );

    }
    catch(err) {
      next(err)
    }

    try {
      const populatedClass = await Class.findById(newStudent.class).populate('subjects'); 
      if(populatedClass) {
        newStudent.courses = populatedClass.subjects.map((subject) => subject._id);
      }
    }
    catch(err) {
      next(err)
    }

    await newStudent.save();
    res.status(200).send(newStudent);
  } catch (err) {
    next(err);
  }
};


export const loginStudent = async (req, res, next) => {
  try {
    const user = await Student.findOne({ username: req.body.username });
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

export const updateStudent = async (req, res, next) => {
  try {

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedStudent);
  } catch (err) {
    next(err);
  }
};

export const deleteStudent = async (req, res, next) => {
    try {
      const student = await Student.findById(req.params.id)

      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }

      try {
        await Class.findByIdAndUpdate(student.class, {$pull: {students: req.params.id}});
      }
      catch (err) {
        next(err);
      }

      await student.remove();
      res.status(200).json("the Student has been deleted");
    } catch (err) {
      next(err);
    }
  };
  
  export const getStudent = async (req, res, next) => {
    try {
      const student = await Student.findById(req.params.id)
      .populate({
        path: 'class',
        select: 'name subjects',
        populate: {
          path: 'subjects',
          model: 'Course',
          populate: {
            path: 'teacher',
            model: 'Faculty',
            select: 'teachername'
          }
        },
      })
      .exec();
    
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }

    // Transform the data before sending it in the response
    const { class: { name, ...classInfo }, ...rest } = student.toObject();
    const transformedStudent = { ...rest, classname: name, classInfo };

    res.status(200).json(transformedStudent);
   } catch (err) {
      next(err);
    }
  };

  // this function fetches info without populate
export const getSingleStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id).populate('class', 'name');
    res.status(200).json(student);
  } catch (err) {
    next(err);
  }
};
  
  export const getStudents = async (req, res, next) => {
    try {
      const students = await Student.find()
      .populate('class', 'name')

      const transformedStudents = students.map(student => {
        if (student.class) {
          const { class: { name, ...classInfo }, ...rest } = student.toObject();
          return { ...rest, classname: name, classInfo };
        } else {
          // Handle the case where 'class' property is undefined
          return student.toObject();
        }
      });
  
      res.status(200).json(transformedStudents);
    } catch (err) {
      next(err)
    }
  }



// enter marks


// edit marks


// delete marks


// get marks of one student


// get marks of all students in a subject


// get marks of students in all subject in a class




