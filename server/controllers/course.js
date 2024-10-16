import Course from "../models/Course.js";
import Class from "../models/Class.js";

export const createCourse = async (req, res, next) => {


  const newCourse = new Course(req.body);
  
  try {

    // add course to courses array in class
    try{
      await Class.updateOne(
        {_id: newCourse.class},
        {$addToSet: {subjects: newCourse._id}}
      )
    }
    catch (err) {
      next(err)
    }

    const savedCourse = await newCourse.save();
    res.status(200).json(savedCourse);
  } catch (err) {
    next(err);
  }
};

export const updateCourse = async (req, res, next) => {
  try {
    
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { $set: req.body},
      { new: true }
    );
    res.status(200).json(course);
  } catch (err) {
    next(err);
  }
};

export const deleteCourse = async (req, res, next) => {
  const course = await Course.findById(req.params.id)

  if(!course) {
    return res.status(404).json({message: "Course not found"})
  }

  try {
    try {
      await Class.findByIdAndUpdate(course.class, {$pull: {subjects: req.params.id}})
    }
    catch(err) {

    }

    await course.remove();
    res.status(200).json("the Course has been deleted");
  } catch (err) {
    next(err);
  }
};

export const getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('class', 'name')
      .populate('teacher', 'teachername');
    
      res.status(200).json(course)
  } catch (err) {
    next(err);
  }
};

// this function fetches info without populate
export const getSingleCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    res.status(200).json(course);
  } catch (err) {
    next(err);
  }
};

export const getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find()
      .populate('class', 'name')
      .populate('teacher', 'teachername');

    res.status(200).json(courses);
  } catch (err) {
    next(err)
  }
}
