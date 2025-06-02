import School from "../models/School.js";
import Admin from "../models/Admin.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/customError.js";

export const createSchool = catchAsync(async (req, res, next) => {

    const {
        name,
        address,
        email,
        phone,
        logo,
        principal,
        viceprincipal,
        username,
        password
    } = req.body;
    const newSchool = await School.create({
        name,
        address,
        email,
        phone,
        logo,
        principal,
        viceprincipal,
    });
    const newAdmin = await Admin.create({
        username,
        password,
        schoolID: newSchool._id
    });
    newSchool.admin = newAdmin._id;
    await newSchool.save();

    res.status(201).json({
        status: 'success',
        message: 'School and admin created successfully',
        data: {
            school: newSchool,
            admin: {
                username: newAdmin.username
            }
        }
    });
});

export const getSchoolInfo = catchAsync(async (req, res, next) => {
    const schoolId = req.params.id || req.user.schoolID; // Support either param or authenticated user

    const school = await School.findById(schoolId).populate('admin', 'username');

    if (!school) {
        return next(new AppError('School not found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: { school }
    });
});

export const editSchoolInfo = catchAsync(async (req, res, next) => {
    const schoolId = req.params.id;

    const school = await School.findById(schoolId);

    if (!school) {
        return next(new AppError('School not found', 404));
    }

    // Authorization check: Only the admin who owns this school can edit
    if (!req.user || req.user.role !== 'admin' || school.admin.toString() !== req.user._id.toString()) {
        return next(new AppError('You are not authorized to update this school', 403));
    }

    const updatableFields = ['name', 'address', 'email', 'phone', 'logo', 'principal', 'viceprincipal'];
    updatableFields.forEach(field => {
        if (req.body[field] !== undefined) {
            school[field] = req.body[field];
        }
    });

    await school.save();

    res.status(200).json({
        status: 'success',
        message: 'School information updated successfully',
        data: { school }
    });
});