import Material from "../models/Material.js";

import fs from "fs";

import { getActiveSession } from "./session.js";
import { catchAsync } from "../utils/catchAsync.js";
import cloudinary from "../utils/cloudinary.js";
import { AppError } from "../utils/customError.js";

import { successMsg, folderName } from "../utils/constants.js";


// create material
// -----------------------------------------------
export const createMaterial = catchAsync(async (req, res, next) => {

  const activeSession = await getActiveSession(req.user);
  let fileUrl = null;
  let cloud_id = null;

  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
    resource_type: 'raw',
    folder: folderName
    });

    fileUrl = result.secure_url;
    cloud_id = result.public_id;

    fs.unlinkSync(req.file.path);
  }

  // Determine authorModel based on user role
  let authorModel = null;
  if (req.user.role === 'admin') {
    authorModel = 'Admin';
  } else if (req.user.role === 'faculty') {
    authorModel = 'Faculty';
  } else {
    return next(new AppError('Invalid user role for author', 400))
  }

  const newMaterial = new Material({
    ...req.body,
    schoolID: req.user.schoolID,
    sessionID: activeSession._id,
    fileUrl,
    cloud_id,
    author: req.user._id,
    authorModel
  });

  await newMaterial.save();
  res.status(201).json({
    status: successMsg,
    message: "Material uploaded successfully!",
    data: newMaterial
  });
});


// Get materials for the user based on role
// -----------------------------------------------
export const getMaterials = catchAsync(async (req, res, next) => {
  let filter = { 
    schoolID: req.user.schoolID,
    sessionID: req.user.sessionID
  };

  if (req.user.role === 'admin' || req.user.role === 'faculty') {
    filter.author = req.user._id;
  } else if (req.user.role === 'student') {
    // Assuming req.user.classId contains the student's class ID
    filter.classID = req.user.class;
  }

  const materials = await Material.find(filter)
    .populate('classID', 'name');

  res.status(200).json({
    status: successMsg,
    data: materials
  });
});


// Edit a material
// -----------------------------------------------
export const editMaterial = catchAsync(async (req, res, next) => {
  let fileUrl = null;
  let cloud_id = null;

  const material = await Material.findById(req.params.id);

  if (!material) {
    return next(new AppError('Material not found', 404));
  }

  if (material.schoolID.toString() !== req.user.schoolID.toString()) {
    return next(new AppError('Not authorized to edit this material', 403));
  }

  if (material.author.toString() !== req.user._id.toString()) {
    return next(new AppError('Not authorized to edit this material', 403));
  }

  if (req.file) {
    if (material.cloud_id) {
      await cloudinary.uploader.destroy(material.cloud_id, { resource_type: 'raw' });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'raw',
      folder: 'erp_portal'
    });

    fileUrl = result.secure_url;
    cloud_id = result.public_id;

    fs.unlinkSync(req.file.path);
  } else {
    fileUrl = material.fileUrl;
    cloud_id = material.cloud_id;
  }

  const updatedMaterial = await Material.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
      fileUrl,
      cloud_id
    },
    { new: true }
  );

  res.status(200).json({
    status: successMsg,
    message: "Material updated successfully!",
    data: updatedMaterial
  });
});


// Delete a material
// -----------------------------------------------
export const deleteMaterial = catchAsync(async (req, res, next) => {
    const material = await Material.findById(req.params.id);

    if (!material) {
        return next(new AppError('Material not found', 404));
    }

    if (material.schoolID.toString() !== req.user.schoolID.toString()) {
        return next(new AppError('Not authorized to delete this material', 403));
    }

    if (material.author.toString() !== req.user._id.toString()) {
        return next(new AppError('Not authorized to delete this material', 403));
    }

    if (material.cloud_id) {
        await cloudinary.uploader.destroy(material.cloud_id, { resource_type: 'raw' });
    }

    await Material.findByIdAndDelete(req.params.id);

    res.status(200).json({
        status: successMsg,
        message: "Material deleted successfully!"
    });
});


// Bulk delete materials
// -----------------------------------------------
export const bulkDeleteMaterial = catchAsync(async (req, res, next) => {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return next(new AppError('No material IDs provided for deletion', 400));
    }
    const materials = await Material.find({ 
        _id: { $in: ids },
        schoolID: req.user.schoolID,
        author: req.user._id
    });
    for (const material of materials) {
        if (material.cloud_id) {
            await cloudinary.uploader.destroy(material.cloud_id, { resource_type: 'raw' });
        }
        await Material.findByIdAndDelete(material._id);
    }
    res.status(200).json({
        status: successMsg,
        message: `${materials.length} materials deleted successfully!`,
    });
});


// Get a single material
// -----------------------------------------------
export const getMaterial = catchAsync(async (req, res, next) => {
    const material = await Material.findById(req.params.id)
        .populate('classID', 'name');

    if (!material) {
        return next(new AppError('Material not found', 404));
    }

    if (material.schoolID.toString() !== req.user.schoolID.toString()) {
        return next(new AppError('Not authorized to view this material', 403));
    }

    res.status(200).json({
        status: successMsg,
        data: material
    });
});