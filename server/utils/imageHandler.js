import cloudinary from '../utils/cloudinary.js';
import fs from 'fs';
import AppError from './customError.js';

/**
 * Uploads a local file to Cloudinary.
 * @param {Object} file - The file object from multer (req.file).
 * @param {Object} options - Cloudinary upload options (e.g., folder, resource_type).
 * @returns {Promise<{url: string, public_id: string}>} - The uploaded file details.
 */
export const uploadFile = async (file, options = {}) => {
  if (!file) return null;

  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: options.folder || 'erp_portal',
      resource_type: options.resourceType || 'auto',
      ...options
    });

    // Clean up local temp file
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    return {
      url: result.secure_url,
      public_id: result.public_id
    };
  } catch (error) {
    // Ensure local file is deleted even on failure
    if (file && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    throw new AppError(`File upload failed: ${error.message}`, 500);
  }
};

/**
 * Deletes a file from Cloudinary.
 * @param {string} publicId - The public ID of the file.
 * @param {Object} options - Cloudinary destroy options.
 * @returns {Promise<Object>} - The result of the destroy operation.
 */
export const deleteFile = async (publicId, options = {}) => {
  if (!publicId) return null;

  try {
    return await cloudinary.uploader.destroy(publicId, {
      resource_type: options.resourceType || 'auto',
      ...options
    });
  } catch (error) {
    console.error(`Cloudinary delete failed for ${publicId}:`, error);
    // We don't throw here to avoid blocking the main deletion flow
    return null;
  }
};

/**
 * Handles image updates: uploads new file and deletes old one if successful.
 * @param {string} oldPublicId - The public ID of the existing image.
 * @param {Object} newFile - The new file from multer.
 * @param {Object} options - Cloudinary options.
 * @returns {Promise<{url: string, public_id: string}|null>} - The new image details.
 */
export const handleImageUpdate = async (oldPublicId, newFile, options = {}) => {
  if (!newFile) return null;

  const uploaded = await uploadFile(newFile, options);

  if (uploaded && oldPublicId) {
    await deleteFile(oldPublicId, options);
  }

  return uploaded;
};
