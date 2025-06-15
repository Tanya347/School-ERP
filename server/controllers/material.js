import Material from "../models/Material.js";
import {getActiveSession} from "./session.js";
import { catchAsync } from "../utils/catchAsync.js";

export const createMaterial = catchAsync(async (req, res, next) => {

    const activeSession = await getActiveSession(req.user);
    console.log("hi")
    const newMaterial = new Material({
        name: req.body.name,
        description: req.body.description,
        sclass: req.body.classId,
        schoolID: req.user.schoolID,
        sessionID: activeSession._id,
        fileUrl: req.body.fileUrl,
        cloud_id: req.body.public_id
    })

    console.log(newMaterial);

    await newMaterial.save();
    res.status(201).json({
        status: 'success',
        message: "Material uploaded successfully!",
        data: newMaterial
    });
});