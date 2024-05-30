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
// Enter marks for a particular subject for all students
export const enterMarksForSubject = async (req, res, next) => {
  try {
    const { subjectId } = req.params; // subject ID from the request parameters
    const { marksData } = req.body; // array of student IDs and marks from the request body

    for (let data of marksData) {
      const { studentId, marks } = data;

      // Find the student by ID
      const student = await Student.findById(studentId);

      if (student) {
        // Check if marks entry for the subject already exists
        const subjectMarks = student.marks.find(m => m.sub_id.toString() === subjectId);

        if (subjectMarks) {
          // If marks entry exists for the subject, update it
          subjectMarks.total = marks;
        } else {
          // If marks entry does not exist, create a new entry
          student.marks.push({ sub_id: subjectId, total: marks });
        }

        // Save the updated student document
        await student.save();
      }
    }

    res.status(200).json({ message: 'Marks entered successfully for all students' });
  } catch (error) {
    next(error);
  }
};

// student --
// get marks of one student
export const getMarksOfStudent = async (req, res, next) => {
  try {
    const { studentid } = req.params;
    const student = await Student.findById(studentid).populate('marks.sub_id', 'name');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json(student.marks);
  } catch (error) {
    next(error);
  }
};

// teacher --
// get marks of all students in a subject
export const getMarksOfSubject = async (req, res, next) => {
  try {
    const { subjectid } = req.params;

    const students = await Student.find({ 'marks.sub_id': subjectid })
      .select('name enroll marks')
      .populate({
        path: 'marks.sub_id',
        select: 'name'
      });

    const result = students.map(student => {
      const subjectMarks = student.marks.find(mark => mark.sub_id._id.toString() === subjectid);
      return {
        studentName: student.name,
        enrollment: student.enroll,
        marks: subjectMarks ? subjectMarks.total : null
      };
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// admin --
// Get marks of students in all subjects in a class
export const getMarksOfClass = async (req, res, next) => {
  try {
    const { classid } = req.params;
    
    const students = await Student.find({ class: classid })
      .select('name enroll marks')
      .populate({
        path: 'marks.sub_id',
        select: 'name'
      });

    const result = students.map(student => ({
      name: student.name,
      enroll: student.enroll,
      marks: student.marks.map(mark => ({
        subject: mark.sub_id.name,
        total: mark.total
      }))
    }));

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};


// teacher --
// clear marks for a subject

export const clearMarksForSubject = async (req, res, next) => {
  try {
    const { subjectid } = req.params;

    // Find all students who have marks for the given subject
    const students = await Student.find({ 'marks.sub_id': subjectid });

    for (let student of students) {
      // Filter out the marks for the given subject
      student.marks = student.marks.filter(mark => mark.sub_id.toString() !== subjectid);

      // Save the updated student document
      await student.save();
    }

    res.status(200).json({ message: 'Marks cleared for the specified subject' });
  } catch (error) {
    next(error);
  }
};

// admin --
// Clear all marks for students in a class
export const clearMarksForClass = async (req, res, next) => {
  try {
    const { classid } = req.params;

    // Find all students in the specified class
    const students = await Student.find({ class: classid });

    for (let student of students) {
      // Clear the marks array
      student.marks = [];

      // Save the updated student document
      await student.save();
    }

    res.status(200).json({ message: 'All marks cleared for the specified class' });
  } catch (error) {
    next(error);
  }
};




