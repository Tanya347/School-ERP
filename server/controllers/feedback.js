import Feedback from '../models/feedback.js';

// Controller function to create a new feedback
export const createFeedback = async (req, res) => {
  try {
    const {
      studentId,
      studentSubject,
      question1,
      question2,
      question3,
      question4,
      question5
    } = req.body;

    const feedback = await Feedback.create({
      studentId,
      studentSubject,
      question1,
      question2,
      question3,
      question4,
      question5
    });

    res.status(201).json({ message: 'Feedback created successfully', feedback });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create feedback', message: error.message });
  }
};

// Controller function to update an existing feedback by ID
export const updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFeedback = req.body;

    const feedback = await Feedback.findByIdAndUpdate(id, updatedFeedback, { new: true });

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.status(200).json({ message: 'Feedback updated successfully', feedback });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update feedback', message: error.message });
  }
};

// Controller function to delete a feedback by ID
export const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    const feedback = await Feedback.findByIdAndDelete(id);

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.status(200).json({ message: 'Feedback deleted successfully', feedback });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete feedback', message: error.message });
  }
};

// Controller function to get a specific feedback by ID
export const getFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    const feedback = await Feedback.findById(id);

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.status(200).json({ feedback });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch feedback', message: error.message });
  }
};

// Controller function to get all feedbacks
export const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find();

    res.status(200).json({ feedbacks });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch feedbacks', message: error.message });
  }
};
