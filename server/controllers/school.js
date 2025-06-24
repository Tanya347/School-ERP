import School from "../models/School.js";
import Admin from "../models/Admin.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/customError.js";
import fs from "fs";
import cloudinary from "../utils/cloudinary.js";
import { sendEmail } from "../utils/email.js";

function generateStrongPassword() {
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=';
    let password = 
        lower[Math.floor(Math.random() * lower.length)] +
        upper[Math.floor(Math.random() * upper.length)] +
        numbers[Math.floor(Math.random() * numbers.length)] +
        symbols[Math.floor(Math.random() * symbols.length)];
    const all = lower + upper + numbers + symbols;
    while (password.length < 8) {
        password += all[Math.floor(Math.random() * all.length)];
    }
    return password.split('').sort(() => 0.5 - Math.random()).join('');
}

function getUsername(name) {
    let baseUsername = name.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    if (baseUsername.length < 5) baseUsername = baseUsername.padEnd(5, '0');
    if (baseUsername.length > 15) baseUsername = baseUsername.slice(0, 15);
    return baseUsername + Math.floor(1000 + Math.random() * 9000);
}

export const createSchool = catchAsync(async (req, res, next) => {
    let logo = null;
    let cloud_id = null;

    if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'erp_portal/school_logos',
            resource_type: 'image'
        });

        logo = result.secure_url;
        cloud_id = result.public_id;

        // Clean up the local file after upload
        fs.unlinkSync(req.file.path);
    }

    const {
        name,
        address,
        email,
        phone,
        principal,
        viceprincipal,
    } = req.body;

    const newSchool = await School.create({
        name,
        address,
        email,
        phone,
        logo,
        principal,
        logo, 
        cloud_id,
        viceprincipal,
    });

    // Generate a valid alphanumeric username (5-20 chars)
    const username = getUsername(name);

    // Generate a strong password (min 6 chars, 1 lowercase, 1 uppercase, 1 number, 1 symbol)
    const password = generateStrongPassword();

    const newAdmin = await Admin.create({
        username,
        password,
        schoolID: newSchool._id
    });

    // Send credentials to school's email
    await sendEmail({
        email: email,
        subject: 'Your Admin Portal Credentials',
        message: `Welcome to the ERP Portal!\n\nYour admin username: ${username}\nYour temporary password: ${password}\n\nPlease log in to the admin portal and change your username and password as soon as possible.`
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
        data: school
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

    let logo = null;
    let cloud_id = null;

    if(req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "erp_portal"
        });
        logo = result.secure_url;
        cloud_id = result.public_id;

        fs.unlinkSync(req.file.path);
    } else {
        logo = school.logo;
        cloud_id = school.cloud_id;
    }

    const updateSchool = await School.findByIdAndUpdate(
        req.params.id,
        {
            ...req.body,
            logo,
            cloud_id,
            admin: school.admin,
            sessions: school.sessions
        },
        { new: true}
    )

    res.status(200).json({
        status: 'success',
        message: 'School information updated successfully',
        data: updateSchool
    });
});