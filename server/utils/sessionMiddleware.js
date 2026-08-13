import { getActiveSession } from '../controllers/session.js';
import { AppError } from './customError.js';

/**
 * Middleware to fetch and attach the currently active academic session to the request object.
 * This avoids repetitive database calls in controllers.
 */
export const sessionMiddleware = async (req, res, next) => {
  try {
    if (!req.user || !req.user.schoolID) {
      return next(new AppError('User authentication or school assignment is missing', 401));
    }

    const activeSession = await getActiveSession(req.user);

    if (!activeSession) {
      return next(new AppError('No active academic session found for this school. Please create one first.', 400));
    }

    // Attach the session to the request object
    req.activeSession = activeSession;
    next();
  } catch (error) {
    next(error);
  }
};
