import Task from "../models/Task.js";
import { catchAsync } from "../utils/catchAsync.js";

export const createTask = catchAsync(async (req, res, next) => {
  req.body.schoolID = req.user.schoolID;
  const newTask = new Task(req.body);
  const savedTask = await newTask.save();
  res.status(200).json({
    status: "success",
    data: savedTask,
    message: "Student has been created successfully!"
  });
});

export const updateTask = catchAsync(async (req, res, next) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    data: task,
    message: "Task has been updated successfully!"
  });
});

export const deleteTask = catchAsync(async (req, res, next) => {
  await Task.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: "success",
    message: "Task has been deleted successfully!"
  });
});

export const getTask = catchAsync(async (req, res, next) => {
  const task = await Task.findById(req.params.id)
    .populate('sclass', 'name')
    .populate('author', 'teachername');
  res.status(200).json({
    status: "success",
    data: task,
  });
});

export const getTasks = catchAsync(async (req, res, next) => {
  const { facultyId, classId } = req.query;
  const schoolId = req.user.schoolID;
  let filter = { schoolID: schoolId };
  if (facultyId) filter.author = facultyId;
  if (classId) filter.sclass = classId;

  const tasks = await Task.find(filter).populate("sclass", "name");

  res.status(200).json({
    status: "success",
    data: tasks,
  });
})
