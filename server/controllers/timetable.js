import Timetable from "../models/Timetable.js";
import { catchAsync } from "../utils/catchAsync.js";

// Create slot
export const createSlot = catchAsync(async (req, res, next) => {
  const slot = await Timetable.create({
    ...req.body,
    schoolID: req.user.schoolID, // from auth middleware
  });
  res.status(201).json({ status: "success", data: slot });
});

export const bulkCreateSlots = catchAsync(async (req, res, next) => {
  const { slots } = req.body;

  const enrichedSlots = slots.map(slot => ({
    ...slot,
    schoolID: req.user.schoolID
  }));

  const created = await Timetable.insertMany(enrichedSlots);

  res.status(201).json({
    status: 'success',
    data: created,
  });
});


// Get all slots for a school (optionally filter by faculty or class)
export const getSlots = catchAsync(async (req, res, next) => {
  const { facultyId, classId } = req.query;
  const filter = { schoolID: req.user.schoolID };
  if (facultyId) filter.faculty = facultyId;
  if (classId) filter.sclass = classId;

  const slots = await Timetable.find(filter)
    .populate("faculty", "teachername")
    .populate("course", "name")
    .populate("sclass", "name");

  res.status(200).json({ status: "success", data: slots });
});

// Update a slot
export const updateSlot = catchAsync(async (req, res, next) => {
  const slot = await Timetable.findOneAndUpdate(
    { _id: req.params.id, schoolID: req.user.schoolID },
    req.body,
    { new: true }
  );
  res.status(200).json({ status: "success", data: slot });
});

// Delete a slot
export const deleteSlot = catchAsync(async (req, res, next) => {
  await Timetable.findOneAndDelete({
    _id: req.params.id,
    schoolID: req.user.schoolID,
  });
  res.status(204).json({ status: "success", message: "Slot deleted" });
});
 