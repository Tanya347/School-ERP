import mongoose from "mongoose";
import validator from "validator";

const SchoolSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'School name is required'],
            minLength: [10, 'School name must be at least 10 characters'],
            maxLength: [100, 'School name must be less than 100 characters'],
            validate: {
                validator: function (v) {
                    return validator.isAlpha(v.replace(/\s/g, '')); // Allows only alphabetic characters and spaces
                },
                message: 'School name should contain only letters and spaces',
            },
        },
        address: {
            type: String,
            required: [true, 'Address is required'],
            minLength: [10, 'Address must be at least 10 characters'],
            maxLength: [200, 'Address must be less than 200 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            maxLength: [50, 'Email must be less than 50 characters'],
            unique: true,
            validate: {
                validator: function (v) {
                    return validator.isEmail(v);
                },
                message: 'Invalid email address',
            },
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            validate: {
              validator: function (v) {
                return validator.isMobilePhone(v, 'any'); // Validates phone number for any locale
              },
              message: 'Invalid phone number',
            },
        },
        logo: {
            type: String,
            validate: {
                validator: function (v) {
                    return !v || validator.isURL(v); 
                },
                message: 'Invalid URL for profile picture',
            },
        },
        cloud_id: {
            type: String,
        },
        principal: {
            type: String,
            minLength: [10, 'Name must be at least 10 characters'],
            maxLength: [50, 'Name must be less than 50 characters'],
            validate: {
                validator: function (v) {
                    return validator.isAlpha(v.replace(/\s/g, '')); // Allows only alphabetic characters and spaces
                },
                message: 'Principal name should contain only letters and spaces',
            },
        },
        viceprincipal: {
            type: String,
            minLength: [10, 'Name must be at least 10 characters'],
            maxLength: [50, 'Name must be less than 50 characters'],
            validate: {
                validator: function (v) {
                    return validator.isAlpha(v.replace(/\s/g, '')); // Allows only alphabetic characters and spaces
                },
                message: 'School name should contain only letters and spaces',
            },
        },
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin',
        },
        sessions: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Session',
            },
        ],
    }
);

export default mongoose.model("School", SchoolSchema);

