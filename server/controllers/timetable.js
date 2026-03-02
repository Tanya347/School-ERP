import Timetable from "../models/Timetable.js";

import { catchAsync } from "../utils/catchAsync.js";
import { getActiveSession } from "./session.js";
import { successMsg } from "../utils/constants.js";
import { AppError } from "../utils/customError.js";


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

  // Validate no faculty has conflicting slots across different classes
  for (const slot of enrichedSlots) {
    if (slot.facultyID) {
      // Check for conflicts with existing slots
      const existingSlots = await Timetable.find({
        facultyID: slot.facultyID,
        day: slot.day,
        classID: { $ne: slot.classID },
        schoolID: req.user.schoolID,
      });

      // Check for time overlaps
      const hasConflict = existingSlots.some(existing => {
        return timeOverlaps(slot.startTime, slot.endTime, existing.startTime, existing.endTime);
      });

      if (hasConflict) {
        return next(
          new AppError(
            `Faculty has conflicting schedule on ${slot.day} across different classes`,
            400
          )
        );
      }

      // Also check for conflicts within the new slots being created
      const otherNewSlots = enrichedSlots.filter(
        s => s.facultyID.toString() === slot.facultyID.toString() &&
             s.day === slot.day &&
             s.classID.toString() !== slot.classID.toString()
      );

      const hasInternalConflict = otherNewSlots.some(other =>
        timeOverlaps(slot.startTime, slot.endTime, other.startTime, other.endTime)
      );

      if (hasInternalConflict) {
        return next(
          new AppError(
            `Faculty has conflicting schedule on ${slot.day} within the new slots being created`,
            400
          )
        );
      }
    }
  }

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


// Helper function to check if two time ranges overlap
const timeOverlaps = (start1, end1, start2, end2) => {
  const toMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const s1 = toMinutes(start1);
  const e1 = toMinutes(end1);
  const s2 = toMinutes(start2);
  const e2 = toMinutes(end2);

  return s1 < e2 && s2 < e1;
};
 