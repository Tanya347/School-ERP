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
