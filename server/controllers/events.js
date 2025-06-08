import Event from "../models/Event.js";
import { catchAsync } from "../utils/catchAsync.js";
import { getActiveSession } from "./session.js";

// Create a new event
export const createEvent = catchAsync(async (req, res, next) => {
  req.body.schoolID = req.user.schoolID;
  const activeSession = await getActiveSession(req.user);
  req.body.sessionID = activeSession._id;
  const newEvent = new Event(req.body);
  const savedEvent = await newEvent.save();
  res.status(200).json({
    data: savedEvent,
    status: 'success',
    message: "The event has been successfully created!"
  });
});

// Update an existing event
export const updateEvent = catchAsync(async (req, res, next) => {
  const event = await Event.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );
  res.status(200).json({
    data: event,
    message: "The event has been successfully updated!",
    status: 'success'
  });
});

// Delete an event
export const deleteEvent = catchAsync(async (req, res, next) => {
  await Event.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: 'success',
    message: "The event has been deleted"
  });
});

// Get a specific event by ID
export const getEvent = catchAsync(async (req, res, next) => {
  const event = await Event.findById(req.params.id);
  res.status(200).json({
    data: event,
    status: 'success'
  });
});

// Get all events
export const getEvents = catchAsync(async (req, res, next) => {
  const schoolId = req.user.schoolID;
  let filter = { schoolID: schoolId };
  const events = await Event.find(filter);
  res.status(200).json({
    data: events,
    status: 'success'
  });
});
