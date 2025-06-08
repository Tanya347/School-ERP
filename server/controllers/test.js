import Test from "../models/Test.js";
import Student from "../models/Student.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/customError.js";
import { getActiveSession } from "./session.js";

export const createTest = catchAsync(async (req, res, next) => {
  req.body.schoolID = req.user.schoolID;
  const activeSession = await getActiveSession(req.user);
  req.body.sessionID = activeSession._id;
  const newTest = new Test(req.body);
  const savedTest = await newTest.save();
  res.status(200).json({
    status: "success",
    data: savedTest,
    message: "Tests has been created successfully!"
  });
});

export const updateTest = catchAsync(async (req, res, next) => {
  const test = await Test.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    data: test,
    message: "Test has been updated successfully!"
  });
});

export const deleteTest = catchAsync(async (req, res, next) => {
  await Test.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: "success",
    message: "Test has been deleted successfully!"
  });
});

export const getTest = catchAsync(async (req, res, next) => {
  const test = await Test.findById(req.params.id)
    .populate("sclass", "name")
    .populate("author", "teachername")
    .populate("subject", "name")
    .populate("marks.student_id", "name enroll")

  res.status(200).json({
    status: "success",
    data: test,
  });
});

export const getSingleTest = catchAsync(async (req, res, next) => {
  const test = await Test.findById(req.params.id);
  res.status(200).json({
    status: "success",
    data: test,
  });
});

export const getTests = catchAsync(async (req, res, next) => {
  const { facultyId, classId } = req.query;
  const schoolId = req.user.schoolID;
  let filter = { schoolID: schoolId };
  if (facultyId) filter.author = facultyId;
  if (classId) filter.sclass = classId;

  const tasks = await Test.find(filter);

  res.status(200).json({
    status: "success",
    data: tasks,
  });
})

// Add/Edit marks for a test
export const addEditMarks = catchAsync(async (req, res, next) => {
  const { testid } = req.params;
  const { marksData } = req.body; // array of student IDs and marks from the request body

  const test = await Test.findById(testid);
  if (!test) {
    return next(new AppError('Test not found', 404));
  }

  const studentsInClass = await Student.find({ class: test.sclass }).select('_id');

  // Create a map of student IDs from marksData for quick lookup
  const marksDataMap = new Map(marksData.map(({ student_id, value }) => [student_id, value]));

  // Process each student in the class
  studentsInClass.forEach(student => {
    const student_id = student._id.toString();
    const value = marksDataMap.has(student_id) ? marksDataMap.get(student_id) : 0;
    const present = marksDataMap.has(student_id);

    const studentMarks = test.marks.find(mark => mark.student_id.toString() === student_id);

    if (studentMarks) {
      // Update existing marks
      studentMarks.value = value;
      studentMarks.present = present;
    } else {
      // Add new marks entry
      test.marks.push({ student_id, value, present });
    }
  });

  // Save the updated test document
  await test.save();

  res.status(200).json({ 
    status: "success",
    message: 'Marks added/edited successfully' 
  });
});


// Get marks of all students for a test
export const getMarksOfAllStudents = catchAsync(async (req, res, next) => {
  const { testid } = req.params;

  const test = await Test.findById(testid).populate('marks.student_id', 'name enroll');
  if (!test) {
  return res.status(404).json({ message: 'Test not found' });
  }

  const studentsInClass = await Student.find({ class: test.sclass }).select('name enroll');

  const result = studentsInClass.map(student => {
    const studentMarks = test.marks.find(mark =>
      mark.student_id && mark.student_id._id.toString() === student._id.toString()
    );
    return {
      studentName: student.name,
      enrollment: student.enroll,
      marks: studentMarks ? studentMarks.value : 0,
      present: studentMarks ? studentMarks.present : false
    }; 
  });

  res.status(200).json({
    status: "success",
    data: result,
  });
});


// Get marks of one student for a test
export const getMarksOfOneStudent = catchAsync(async (req, res, next) => {
  const { testid, studentid } = req.params;

  const test = await Test.findById(testid);
  if (!test) {
    return res.status(404).json({ message: 'Test not found' });
  }

  const student = await Student.findById(studentid).select('name enroll');
  if (!student) {
    return res.status(404).json({ message: 'Student not found' });
  }

  const studentMarks = test.marks.find(mark =>
    mark.student_id && mark.student_id.toString() === studentid
  );

  const result = {
    studentName: student.name,
    enrollment: student.enroll,
    marks: studentMarks ? studentMarks.value : 0,
    present: studentMarks ? studentMarks.present : false
  };

  res.status(200).json({
    status: "success",
    data: result,
  });
});


// Clear marks of a test
export const clearMarksOfTest = catchAsync(async (req, res, next) => {
  const { testid } = req.params;

  const test = await Test.findById(testid);
  if (!test) {
    return res.status(404).json({ message: 'Test not found' });
  }

  // Clear the marks array
  test.marks = [];

  // Save the updated test document
  await test.save();

  res.status(200).json({ 
    status: 'success',
    message: 'Marks cleared successfully'
  });
});
