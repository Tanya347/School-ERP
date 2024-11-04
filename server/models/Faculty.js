import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const FacultySchema = new mongoose.Schema(
  {
    teachername: {
      type: String,
      required: [true, 'Teacher name is required'],
      minLength: [3, 'Teacher name must be at least 3 characters'],
      maxLength: [50, 'Teacher name must be less than 50 characters'],
      validate: {
        validator: function (v) {
          return validator.isAlpha(v.replace(/\s/g, '')); // Allows only alphabetic characters and spaces
        },
        message: 'Teacher name should contain only letters and spaces',
      },
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      minLength: [5, 'Username must be at least 5 characters'],
      maxLength: [20, 'Username must be less than 20 characters'],
      unique: true,
      validate: {
        validator: function (v) {
          return validator.isAlphanumeric(v);
        },
        message: 'Username should contain only letters and numbers',
      },
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
        message: props => `${props.value} is not a valid email address`
      },
    },
    enroll: {
      type: String,
      required: [true, 'Enrollment number is required'],
      validate: [
        {
            validator: function(v) {
                return validator.isNumeric(v); // Check if the value is numeric
            },
            message: 'Enrollment number should contain only numbers'
        },
        {
            validator: function(v) {
                return /^\d{10}$/.test(v); // Check if the string is exactly 10 digits
            },
            message: 'Enrollment number must be exactly 10 digits'
        }
      ]
    },
    profilePicture: {
      type: String,
      validate: {
        validator: function (v) {
          return !v || validator.isURL(v); // Optional field, but if present, must be a valid URL
        },
        message: 'Invalid URL for profile picture',
      },
    },
    cloud_id: {
      type: String,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      validate: {
        validator: function (v) {
          return validator.isStrongPassword(v, {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
          });
        },
        message:
          'Password must be at least 6 characters long and include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol',
      },
      select: false, // Ensures password is not returned in queries by default
    },
    gender: {
      type: String,
      required: [true, 'Gender is required'],
      enum: ['Male', 'Female'], // Restricts to specific values
      validate: {
        validator: function (v) {
          return ['Male', 'Female'].includes(v);
        },
        message: 'Gender must be "male" or "female"',
      },
    },
    facultyPhone: {
      type: String,
      required: [true, 'Phone number is required'],
      validate: {
        validator: function (v) {
          return validator.isMobilePhone(v, 'any'); // Validates phone number for any locale
        },
        message: 'Invalid phone number',
      },
    },
    facultyAddress: {
      type: String,
      required: [true, 'Address is required'],
      minLength: [10, 'Address must be at least 10 characters'],
      maxLength: [200, 'Address must be less than 200 characters'],
    },
    dob: {
      type: String,
      required: [true, 'Date of birth is required'],
      validate: {
        validator: function (v) {
          return validator.isDate(v, { format: 'YYYY-MM-DD', strictMode: true });
        },
        message: 'Invalid date of birth format (expected YYYY-MM-DD)',
      },
    },
    joiningYear: {
      type: String,
      required: [true, 'Joining year is required'],
      validate: {
        validator: function (v) {
          return validator.isInt(v, { min: 1900, max: new Date().getFullYear() });
        },
        message: 'Joining year must be a valid year between 1900 and the current year',
      },
    },
    role: {
      type: String,
      default: 'faculty',
    },
    subjectsTaught: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
      },
    ],
    classesTaught: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
      },
    ],
  },
  { timestamps: true }
);

FacultySchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
})

FacultySchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

export default mongoose.model("Faculty", FacultySchema);