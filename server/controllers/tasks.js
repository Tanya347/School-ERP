import Task from "../models/Task.js";

export const createTask = async (req, res, next) => {

  const newTask = new Task(req.body);
  try {
    const savedTask = await newTask.save();
    res.status(200).json(savedTask);
  } catch (err) {
    next(err);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json("the Task has been deleted");
  } catch (err) {
    next(err);
  }
};

export const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate('sclass', 'name').populate('author', 'teachername');
    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
};

// fetches tasks without population
export const getSingleTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
};

export const getFacultyTasks = async (req, res, next) => {
  const facultyId = req.params.id;
  
  try {
    const tasks = await Task.find({ author: facultyId }).populate('sclass', 'name');
    res.status(200).json(tasks);
  } catch (err) {
    next(err)
  }
}

export const getStudentTasks = async (req, res, next) => {
  const classId = req.params.id;
  
  try {
    const tasks = await Task.find({ sclass: classId }).populate('sclass', 'name');
    res.status(200).json(tasks);
  } catch (err) {
    next(err)
  }
}
