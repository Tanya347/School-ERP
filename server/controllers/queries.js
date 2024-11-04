import Query from "../models/Query.js";
import Faculty from "../models/Faculty.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/customError.js";

// Create a new query
export const createQuery = catchAsync(async (req, res, next) => {
  const newQuery = new Query(req.body);

  const faculty = await Faculty.findById(newQuery.queryTo);
  if (!faculty) {
    return next(new AppError("Faculty not found", 404));
  }

  newQuery.teacher = faculty.name;
  const savedQuery = await newQuery.save();
  res.status(200).json({
    data: savedQuery,
    message: "The query has been successfully created!",
    status: 'success'
  });
});

// Update an existing query
export const updateQuery = catchAsync(async (req, res, next) => {
  const query = await Query.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );

  if (!query) {
    return next(new AppError("Query not found", 404));
  }

  res.status(200).json({
    data: query,
    message: "The query has been successfully created!",
    status: 'success'
  });
});

// Delete a query
export const deleteQuery = catchAsync(async (req, res, next) => {
  const query = await Query.findByIdAndDelete(req.params.id);
  if (!query) {
    return res.status(404).json({ message: "Query not found" });
  }

  res.status(200).json({
    status: 'success',
    message: "The Query has been deleted"
  });
});

// Get a single query
export const getQuery = catchAsync(async (req, res, next) => {
  const query = await Query.findById(req.params.id);
  if (!query) {
    return res.status(404).json({ message: "Query not found" });
  }

  res.status(200).json({
    status: 'success',
    data: query
  });
});

// Get all queries
export const getQuerys = catchAsync(async (req, res, next) => {
  const querys = await Query.find();
  res.status(200).json({
    status: 'success',
    data: querys
  });
});
