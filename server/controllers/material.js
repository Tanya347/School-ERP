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

    const newMaterial = new Material({
        ...req.body,
        schoolID: req.user.schoolID,
        sessionID: activeSession._id,
        fileUrl,
        cloud_id
    })

    console.log(newMaterial);

    await newMaterial.save();
    res.status(201).json({
        status: 'success',
        message: "Material uploaded successfully!",
        data: newMaterial
    });
});