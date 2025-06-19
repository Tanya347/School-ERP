import Faculty from "../models/Faculty.js";
import Course from "../models/Course.js";
import Class from "../models/Class.js";
import { catchAsync } from "../utils/catchAsync.js";
import fs from "fs";
import cloudinary from "../utils/cloudinary.js";

export const registerFaculty = catchAsync(async (req, res, next) => {
  
  req.body.schoolID = req.user.schoolID;

  let profilePicture = null;
  let cloud_id = null;

  if(req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "erp_portal",
    });
    profilePicture = result.secure_url;
    cloud_id = result.public_id;

    fs.unlinkSync(req.file.path);
  }

  const newUser  = await Faculty.create({
    ...req.body,
    profilePicture,
    cloud_id,
  });

  res.status(201).json({
    status: 'success',
    data: { user: newUser  },
    message: 'Faculty created successfully!'
  });
})

// Update a faculty member
export const updateFaculty = catchAsync(async (req, res, next) => {
  let profilePicture = null;
  let cloud_id = null;

  const faculty = await Faculty.findById(req.params.id);

  if (!faculty) {
    return res.status(404).json({ message: "Faculty not found" });
  }
  if (req.file) {
    if (faculty.cloud_id) {
      await cloudinary.uploader.destroy(faculty.cloud_id);
    }
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "erp_portal",
    });
    profilePicture = result.secure_url;
    cloud_id = result.public_id;

    fs.unlinkSync(req.file.path);
  } else {
    profilePicture = faculty.profilePicture;
    cloud_id = faculty.cloud_id;
  }

  const updatedFaculty = await Faculty.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
      profilePicture,
      cloud_id,
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    data: updatedFaculty
  });
});

// Delete a faculty member
export const deleteFaculty = catchAsync(async (req, res, next) => {
  const faculty = await Faculty.findById(req.params.id);
  if (faculty.cloud_id) {
    await cloudinary.uploader.destroy(faculty.cloud_id);
  }
  await Faculty.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: "success",
    message: "The Faculty has been deleted"
  });
});

// Get a single faculty member
export const getFaculty = catchAsync(async (req, res, next) => {
  const faculty = await Faculty.findById(req.params.id)
    .populate("subjectsTaught")
    .populate("classesTaught", "name");
  res.status(200).json({
    status: "success",
    data: faculty
  });
});

// Get all faculty members
export const getFacultys = catchAsync(async (req, res, next) => {
  const schoolId = req.user.schoolID;
  let filter = { schoolID: schoolId };
  const facultys = await Faculty.find(filter).populate("subjectsTaught");
  res.status(200).json({
    status: "success",
    data: facultys
  });
});

// Get faculty classes
export const getFacultyClasses = catchAsync(async (req, res, next) => {
  const faculty = await Faculty.findById(req.params.id).populate(
    "classesTaught",
    "name"
  );

  const classes = faculty.classesTaught.map((sclass) => ({
    _id: sclass._id,
    name: sclass.name,
  }));

  res.status(200).json({
    status: "success",
    data: classes
  });
});

// Get faculty courses
export const getFacultyCourses = catchAsync(async (req, res, next) => {
  const faculty = await Faculty.findById(req.params.id).populate(
    "subjectsTaught",
    "name subjectCode class marksAdded"
  );

  const courses = faculty.subjectsTaught.map((course) => ({
    _id: course._id,
    name: course.name,
    sclass: course.class,
    subjectCode: course.subjectCode,
    marksAdded: course.marksAdded,
  }));

  res.status(200).json({
    status: "success",
    data: courses
  });
});

// Add a new course to a faculty member
export const AddNewCourse = catchAsync(async (req, res, next) => {
  const facId = req.params.facId;
  const classId = req.params.classId;
  const courseId = req.params.courseId;

  // Update Faculty model
  await Faculty.updateOne(
    { _id: facId },
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

  res.status(200).json({ 
    status: "success",
    message: "Course added successfully." 
  });
});
