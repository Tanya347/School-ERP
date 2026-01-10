import Task from "../models/Task.js";

import { catchAsync } from "../utils/catchAsync.js";
import { getActiveSession } from "./session.js";
import { successMsg } from "../utils/constants.js";


// create task
// -----------------------------------------------
export const createTask = catchAsync(async (req, res, next) => {
  req.body.schoolID = req.user.schoolID;
  const activeSession = await getActiveSession(req.user);
  req.body.sessionID = activeSession._id;
  const newTask = new Task(req.body);
  const savedTask = await newTask.save();
  res.status(200).json({
    status: successMsg,
    data: savedTask,
    message: "Student has been created successfully!"
  });
});


// update task
// -----------------------------------------------
export const updateTask = catchAsync(async (req, res, next) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );
  res.status(200).json({
    status: successMsg,
    data: task,
    message: "Task has been updated successfully!"
  });
});


// delete task
// -----------------------------------------------
export const deleteTask = catchAsync(async (req, res, next) => {
  await Task.deleteOne({
    _id: req.params.id,
    schoolID: req.user.schoolID
  });
  res.status(200).json({
    status: successMsg,
    message: "Task has been deleted successfully!"
  });
});

// delete bulk tasks
// -----------------------------------------------
export const deleteBulkTasks = catchAsync(async (req, res, next) => {
  const { ids } = req.body;
  await Task.deleteMany({
    _id: { $in: ids },
    schoolID: req.user.schoolID
  });
  res.status(200).json({
    status: successMsg,
    message: "Tasks have been deleted successfully!"
  });
});


// get task
// -----------------------------------------------
export const getTask = catchAsync(async (req, res, next) => {
  const task = await Task.findById(req.params.id)
    .populate('courseID', 'name subjectCode')
    .populate('author', 'teachername');
  res.status(200).json({
    status: successMsg,
    data: task,
  });
});


// get tasks with filters
// -----------------------------------------------
export const getTasks = catchAsync(async (req, res) => {
  const { facultyId, classId } = req.query;
  const schoolId = req.user.schoolID;
  let filter = { schoolID: schoolId };
  if (facultyId) filter.author = facultyId;

  let tasks = await Task.find(filter).populate("courseID", "subjectCode classID");

  if (classId) {
    tasks = tasks.filter(task => task?.courseID && task?.courseID?.classID?.toString() === classId);
  }

  res.status(200).json({
    status: successMsg,
    data: tasks,
  });
});
