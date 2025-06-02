import Student from "../models/Student.js";
import Class from "../models/Class.js";
import Course from "../models/Course.js";
import { catchAsync } from "../utils/catchAsync.js";

export const registerStudent = catchAsync(async (req, res, next) => {
  req.body.schoolID = req.user.schoolID;
  const newUser  = await Student.create(req.body);
  res.status(201).json({
    status: 'success',
    data: { user: newUser  },
    message: 'Student created successfully!'
  });
})

export const updateStudent = catchAsync(async (req, res, next) => {
  const updatedStudent = await Student.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    data: updatedStudent,
    message: "Student has been updated successfully!"
  });
});

export const deleteStudent = catchAsync(async (req, res, next) => {
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).json({ message: "Student not found" });

  await Class.findByIdAndUpdate(student.class, { $pull: { students: req.params.id } });
  await student.remove();
  res.status(200).json({
    status: "success",
    message: "Student has been deleted successfully!"
  });
});

export const getStudent = catchAsync(async (req, res, next) => {
  const student = await Student.findById(req.params.id)
    .populate({
      path: 'class',
      select: 'name subjects',
      populate: { path: 'subjects', model: 'Course', populate: { path: 'teacher', model: 'Faculty', select: 'teachername' } },
    })
    .exec();

  if (!student) return res.status(404).json({ message: "Student not found" });

  const { class: { name, ...classInfo }, ...rest } = student.toObject();
  const transformedStudent = { ...rest, classname: name, classInfo };

  res.status(200).json({
    status: "success",
    data: transformedStudent,
  });
});

export const getSingleStudent = catchAsync(async (req, res, next) => {
  const student = await Student.findById(req.params.id).populate('class', 'name');
  res.status(200).json({
    data: student,
    status: 'success'
  });
});

export const getStudents = catchAsync(async (req, res, next) => {
  const schoolId = req.user.schoolID;
  let filter = { schoolID: schoolId };
  const students = await Student.find(filter).populate('class', 'name');
  res.status(200).json({
    status: "success",
    data: students
  });
});

export const enterMarksForSubject = catchAsync(async (req, res, next) => {
  const { subjectId } = req.params;
  const { marksData } = req.body;

  for (let data of marksData) {
    const { studentId, marks } = data;
    const student = await Student.findById(studentId);

    if (student) {
      const subjectMarks = student.marks.find((m) => m.sub_id.toString() === subjectId);
      if (subjectMarks) {
        subjectMarks.total = marks;
      } else {
        student.marks.push({ sub_id: subjectId, total: marks });
      }
      await student.save();
    }
  }

  await Course.findByIdAndUpdate(subjectId, { marksAdded: true });
  res.status(200).json({ 
    status: "success",
    message: "Marks entered successfully for all students" 
  });
});

export const getMarksOfStudent = catchAsync(async (req, res, next) => {
  const { studentid } = req.params;
  const student = await Student.findById(studentid).populate('marks.sub_id', 'name');

  if (!student) return res.status(404).json({ message: "Student not found" });

  res.status(200).json({
    status: "success",
    data: student.marks
  });
});

export const getMarksOfSubject = catchAsync(async (req, res, next) => {
  const { subjectid } = req.params;
  const students = await Student.find({ 'marks.sub_id': subjectid })
    .select('name enroll marks')
    .populate({ path: 'marks.sub_id', select: 'name' });

  const result = students.map((student) => {
    const subjectMarks = student.marks.find((mark) => mark.sub_id._id.toString() === subjectid);
    return {
      studentName: student.name,
      enrollment: student.enroll,
      marks: subjectMarks ? subjectMarks.total : null,
    };
  });

  res.status(200).json({
    status: "success",
    data: result
  });
});

export const getMarksOfClass = catchAsync(async (req, res, next) => {
  const { classid } = req.params;
  const students = await Student.find({ class: classid })
    .select('name enroll marks')
    .populate({ path: 'marks.sub_id', select: 'name' });

  const uniqueSubjects = new Set();
  students.forEach((student) => {
    student.marks.forEach((mark) => uniqueSubjects.add(mark.sub_id.name));
  });

  const transformedData = students.map((student) => {
    const studentData = { _id: student._id, studentName: student.name, enrollment: student.enroll };
    uniqueSubjects.forEach((subject) => {
      studentData[subject] = 0;
    });
    student.marks.forEach((mark) => {
      studentData[mark.sub_id.name] = mark.total;
    });
    return studentData;
  });

  res.status(200).json({
    status: "success",
    data: transformedData
  });
});

export const clearMarksForSubject = catchAsync(async (req, res, next) => {
  const { subjectid } = req.params;
  const students = await Student.find({ 'marks.sub_id': subjectid });

  for (let student of students) {
    student.marks = student.marks.filter((mark) => mark.sub_id.toString() !== subjectid);
    await student.save();
  }

  await Course.findByIdAndUpdate(subjectid, { marksAdded: false });
  res.status(200).json({ 
    status: "success",
    message: "Marks cleared for the specified subject" 
  });
});

export const clearMarksForClass = catchAsync(async (req, res, next) => {
  const { classid } = req.params;
  const students = await Student.find({ class: classid });

  for (let student of students) {
    student.marks = [];
    await student.save();
  }

  res.status(200).json({ 
    status: 'success',
    message: "All marks cleared for the specified class" 
  });
});
