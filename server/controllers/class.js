import Class from "../models/Class.js";
import Student from "../models/Student.js";
import Attendance from "../models/Attendance.js"

export const createClass = async (req, res, next) => {

    const newClass = new Class(req.body);
    try {
        const savedClass = await newClass.save();
        res.status(200).json(savedClass);
    } catch (err) {
        next(err);
    }
};

export const updateClass = async (req, res, next) => {
    try {
        const sclass = await Class.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(sclass);
    } catch (err) {
        next(err);
    }
};

export const deleteClass = async (req, res, next) => {
    try {
        const deletedClass = await Class.findById(req.params.id);

        if (!deletedClass) {
        return res.status(404).json({ message: 'Class not found' });
        }

        // Remove class reference from associated students
        await Student.updateMany(
        { class: deletedClass._id },
        { $unset: { class: 1 } }
        );

        // Now, delete the class
        await deletedClass.remove();

        res.status(200).json("the Class has been deleted");
    } catch (err) {
        next(err);
    }
};

export const getClassDetails = async (req, res, next) => {
  const classId = req.params.id;

  try {
      const classDetails = await Class.findById(classId)
      .populate({
          path: 'subjects',
          model: 'Course',
          select: 'name subjectCode teacher',
          populate: {
          path: 'teacher',
          model: 'Faculty',
          select: 'teachername', // Only fetch the name field of the teacher
          },
      })
      .populate({
          path: 'students',
          model: 'Student',
          select: 'name profilePicture cloud_id gender enroll email studentPhone',
      });

      res.status(200).json(classDetails);
  } catch (err) {
      next(err);
  }
};

export const getClassSubjects = async (req, res, next) => {
  const classId = req.params.id;

  try {
    const courses = await Class.findById(classId).populate('subjects');
    
    const subjects = courses.subjects.map(sub => {
      return {
        _id: sub._id,
        name: sub.name,
        code: sub.subjectCode
      }
    })
    res.status(200).json(subjects);
  }
  catch(err) {
    next(err);
  }
}
  

export const getClassStudents = async (req, res, next) => {
    const classId = req.params.id;

    try {
        const classStudents = await Class.findById(classId)
        .populate({
            path: 'students',
            model: 'Student',
            select: 'name profilePicture cloud_id gender enroll studentPhone email',
        });

        res.status(200).json(classStudents);
    } catch (err) {
        next(err);
    }
};

export const getClasses = async (req, res, next) => {
    try {
        const classes = await Class.find();
        res.status(200).json(classes);
    } catch (err) {
        next(err)
    }
}

export const getClassesWithSubjects = async(req, res, next) => {
    try {
        const classes = await Class.find().populate({
            path: 'subjects',
            model: 'Course', // Specify the model for the 'subjects' path
          });

        res.status(200).json(classes);
    }
    catch(err) {
        next(err)
    }
}
