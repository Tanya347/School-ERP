import AppError from './customError.js';

/**
 * Verifies if the resource is owned by the given user.
 * @param {Object} resource - The Mongoose document to check.
 * @param {Object} user - The authenticated user object.
 * @returns {boolean} - True if the user owns the resource.
 * @throws {AppError} - If the resource is not owned by the user.
 */
export const verifyOwnership = (resource, user) => {
  if (!resource || !user) return false;

  const authorId = resource.author?.toString();
  const userId = user._id?.toString();

  return authorId === userId;
};

/**
 * Standardized check that throws an AppError if ownership is not verified.
 * @param {Object} resource - The Mongoose document to check.
 * @param {Object} user - The authenticated user object.
 * @returns {void}
 */
export const ensureOwnership = (resource, user) => {
  if (!verifyOwnership(resource, user)) {
    throw new AppError('You do not have permission to perform this action', 403);
  }
};
