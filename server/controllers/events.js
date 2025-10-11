import Event from "../models/Event.js";
import { catchAsync } from "../utils/catchAsync.js";
import { getActiveSession } from "./session.js";
import fs from "fs";
import cloudinary from "../utils/cloudinary.js";

// Create a new event
export const createEvent = catchAsync(async (req, res, next) => {
  req.body.schoolID = req.user.schoolID;
  const activeSession = await getActiveSession(req.user);
  req.body.sessionID = activeSession._id;
  let poster = null;
  let cloud_id = null;

  // Ensure startDate and endDate are valid ISO 8601 strings
  if (req.body.startDate) {
    const start = new Date(req.body.startDate);
    if (!isNaN(start)) {
      req.body.startDate = start.toISOString();
    }
  }
  if (req.body.endDate) {
    const end = new Date(req.body.endDate);
    if (!isNaN(end)) {
      req.body.endDate = end.toISOString();
    }
  }

  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "erp_portal",
    });

    poster = result.secure_url;
    cloud_id = result.public_id;

    fs.unlinkSync(req.file.path);
  }

  const newEvent = new Event({...req.body, poster, cloud_id});
  const savedEvent = await newEvent.save();
  res.status(200).json({
    data: savedEvent,
    status: 'success',
    message: "The event has been successfully created!"
  });
});

// Update an existing event
export const updateEvent = catchAsync(async (req, res, next) => {
  let poster = null;
  let cloud_id = null;
  const event = await Event.findById(req.params.id);
  if (!event) {
    return next(new Error("Event not found"));
  }

  if (req.file) {
    if (event.cloud_id) {
      await cloudinary.uploader.destroy(event.cloud_id);
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "erp_portal",
    });

    poster = result.secure_url;
    cloud_id = result.public_id;

    fs.unlinkSync(req.file.path);
  } else {
    poster = event.poster;
    cloud_id = event.cloud_id;
  }

  const updatedEvent = await Event.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
      poster,
      cloud_id
    },
    { new: true }
  );
  res.status(200).json({
    data: updatedEvent,
    message: "The event has been successfully updated!",
    status: 'success'
  });
});

// Delete an event
export const deleteEvent = catchAsync(async (req, res, next) => {
  const event = await Event.findById(req.params.id);
  if(event.cloud_id) {
    await cloudinary.uploader.destroy(event.cloud_id);
  }
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
