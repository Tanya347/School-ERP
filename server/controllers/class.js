import Class from "../models/Class.js";
import Student from "../models/Student.js";
import { catchAsync } from "../utils/catchAsync.js";

// Create a new class
export const createClass = catchAsync(async (req, res, next) => {
  req.body.schoolID = req.user.schoolID;
  const newClass = new Class(req.body);
  const savedClass = await newClass.save();
  res.status(200).json({
    status: 'success',
    data: savedClass,
    message: 'Class created successfully!'
  });
});

// Update an existing class
export const updateClass = catchAsync(async (req, res, next) => {
  const sclass = await Class.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );
  res.status(200).json({
    status: 'success',
    data: sclass,
    message: 'Class updated successfully!'
  });
});

// Delete a class and unset class reference from students
export const deleteClass = catchAsync(async (req, res, next) => {
  const deletedClass = await Class.findById(req.params.id);
  if (!deletedClass) {
    return res.status(404).json({ message: 'Class not found' });
  }

  // Remove class reference from associated students
  await Student.updateMany(
    { class: deletedClass._id },
    { $unset: { class: 1 } }
  );

  // Delete the class
  await deletedClass.remove();
  res.status(200).json({
    message: "The class has been deleted",
    status: 'success'
  });
});

// Get class details with populated subjects and students
export const getClassDetails = catchAsync(async (req, res, next) => {
  const classId = req.params.id;
  const classDetails = await Class.findById(classId)
    .populate({
      path: 'subjects',
      model: 'Course',
      select: 'name subjectCode teacher syllabusPicture',
      populate: {
        path: 'teacher',
        model: 'Faculty',
        select: 'teachername',
      },
    })
    .populate({
      path: 'students',
      model: 'Student',
      select: 'name profilePicture cloud_id gender enroll email studentPhone',
    });
  res.status(200).json({
    data: classDetails,
    status: 'success'
  });
});

// Get class subjects
export const getClassSubjects = catchAsync(async (req, res, next) => {
  const classId = req.params.id;
  const courses = await Class.findById(classId).populate('subjects');
  const subjects = courses.subjects.map((sub) => ({
    _id: sub._id,
    name: sub.name,
    code: sub.subjectCode,
  }));
  res.status(200).json({
    data: subjects,
    status: 'success'
  });
});

// Get class students
export const getClassStudents = catchAsync(async (req, res, next) => {
  const classId = req.params.id;
  const classStudents = await Class.findById(classId).populate({
    path: 'students',
    model: 'Student',
    select: 'name profilePicture cloud_id gender enroll studentPhone email',
  });
  res.status(200).json({
    data: classStudents,
    status: 'success'
  });
});

// Get all classes
export const getClasses = catchAsync(async (req, res, next) => {
  const schoolId = req.user.schoolID;
  let filter = { schoolID: schoolId };
  const classes = await Class.find(filter).sort({classNumber: 1});
  res.status(200).json({
    data: classes,
    status: 'success'
  });
});

// Get all classes with subjects populated
export const getClassesWithSubjects = catchAsync(async (req, res, next) => {
  const schoolId = req.user.schoolID;
  let filter = { schoolID: schoolId };
  const classes = await Class.find(filter).populate({
    path: 'subjects',
    model: 'Course',
  }).sort({classNumber: 1});
  res.status(200).json({
    data: classes,
    status: 'success'
  });
});
 