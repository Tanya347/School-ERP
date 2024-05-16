import express from 'express';
import {
  createFeedback,
  updateFeedback,
  deleteFeedback,
  getFeedback,
  getAllFeedbacks,
} from '../controllers/feedback.js';

const router = express.Router();

// Create a new feedback
router.post("/create", createFeedback);

// Update an existing feedback by ID
router.put("/update", updateFeedback);

// Delete a feedback by ID
router.delete("/del", deleteFeedback);

// Get a specific feedback by ID
router.get("/get", getFeedback);

// Get all feedbacks
router.get("/getall", getAllFeedbacks);

export default router;
