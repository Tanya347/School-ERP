import Material from "../models/Material.js";
import {getActiveSession} from "./session.js";
import { catchAsync } from "../utils/catchAsync.js";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";

export const createMaterial = catchAsync(async (req, res, next) => {

  const activeSession = await getActiveSession(req.user);
  let fileUrl = null;
  let cloud_id = null;

  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
    resource_type: 'raw',
    folder: 'erp_portal'
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
    return res.status(400).json({
    status: 'fail',
    message: 'Invalid user role for author'
    });
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
    status: 'success',
    message: "Material uploaded successfully!",
    data: newMaterial
  });
});

export const getMaterials = catchAsync(async (req, res, next) => {
  let filter = { schoolID: req.user.schoolID };

  if (req.user.role === 'admin' || req.user.role === 'faculty') {
    filter.author = req.user._id;
  } else if (req.user.role === 'student') {
    // Assuming req.user.classId contains the student's class ID
    filter.classId = req.user.class;
  }

  const materials = await Material.find(filter)
    .populate('classId', 'name');

  res.status(200).json({
    status: 'success',
    data: materials
  });
});

export const editMaterial = catchAsync(async (req, res, next) => {
  let fileUrl = null;
  let cloud_id = null;

  const material = await Material.findById(req.params.id);

  if (!material) {
    return res.status(404).json({
      status: 'fail',
      message: 'Material not found'
    });
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
    status: 'success',
    message: "Material updated successfully!",
    data: updatedMaterial
  });
});

export const deleteMaterial = catchAsync(async (req, res, next) => {
    const material = await Material.findById(req.params.id);

    if (material.cloud_id) {
        await cloudinary.uploader.destroy(material.cloud_id, { resource_type: 'raw' });
    }

    await Material.findByIdAndDelete(req.params.id);

    res.status(200).json({
        status: 'success',
        message: "Material deleted successfully!"
    });
});

export const getMaterial = catchAsync(async (req, res, next) => {
    const material = await Material.findById(req.params.id)
        .populate('classId', 'name');

    if (!material) {
        return res.status(404).json({
            status: 'fail',
            message: 'Material not found'
        });
    }

    res.status(200).json({
        status: 'success',
        data: material
    });
});