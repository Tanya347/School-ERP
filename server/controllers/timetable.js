import Timetable from "../models/Timetable.js";

import { catchAsync } from "../utils/catchAsync.js";
import { getActiveSession } from "./session.js";
import { successMsg } from "../utils/constants.js";


// Create slot
// -----------------------------------------------
export const createSlot = catchAsync(async (req, res, next) => {
  const slot = await Timetable.create({
    ...req.body,
    schoolID: req.user.schoolID, // from auth middleware
  });
  res.status(201).json({ status: successMsg, data: slot });
});


// Bulk create slots
// -----------------------------------------------
export const bulkCreateSlots = catchAsync(async (req, res, next) => {
  const { slots } = req.body;
  const activeSession = await getActiveSession(req.user);

  const enrichedSlots = slots.map(slot => ({
    ...slot,
    schoolID: req.user.schoolID,
    sessionID: activeSession._id,
  }));

  const created = await Timetable.insertMany(enrichedSlots);

  res.status(201).json({
    status: successMsg,
    data: created,
  });
});


// Get all slots for a school (optionally filter by faculty or class)
// -----------------------------------------------
export const getSlots = catchAsync(async (req, res, next) => {
  const { facultyId, classId } = req.query;
  const filter = { schoolID: req.user.schoolID };
  if (facultyId) filter.facultyID = facultyId;
  if (classId) filter.classID = classId;

  const slots = await Timetable.find(filter)
    .populate("facultyID", "teachername")
    .populate("courseID", "name")
    .populate("classID", "name");

  res.status(200).json({ status: successMsg, data: slots });
});


// Update a slot
// -----------------------------------------------
export const updateSlot = catchAsync(async (req, res, next) => {
  const slot = await Timetable.findOneAndUpdate(
    { _id: req.params.id, schoolID: req.user.schoolID },
    req.body,
    { new: true }
  );
  res.status(200).json({ status: successMsg, data: slot });
});


// Delete a slot
// -----------------------------------------------
export const deleteSlotsForClass = catchAsync(async (req, res, next) => {
  const classId = req.params.id;
  if (!classId) {
    return next(new AppError('classId query parameter is required', 400));
  }

  await Timetable.deleteMany({
    classID: classId,
    schoolID: req.user.schoolID,
  });

  res.status(200).json({ status: successMsg, message: "All slots for the class deleted" });
});
 