import mongoose from "mongoose"; 
import validator from "validator";
import bcrypt from "bcryptjs";

const StudentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Student name is required'],
      minLength: [3, 'Student name must be at least 3 characters'],
      maxLength: [50, 'Student name must be less than 50 characters'],
      validate: {
        validator: function (v) {
          return validator.isAlpha(v.replace(/\s/g, '')); // Allows only alphabetic characters and spaces
        },
        message: 'Student name should contain only letters and spaces',
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
        message: 'Invalid email address',
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
          return !v || validator.isURL(v); 
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
      select: false, 
    },
    gender: {
      type: String,
      required: [true, 'Gender is required'],
      enum: ['Male', 'Female'], // Restricts to specific values
      validate: {
        validator: function (v) {
          return ['Male', 'Female'].includes(v);
        },
        message: 'Gender must be "Male" or "Female"',
      },
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
    },
    studentPhone: {
      type: String,
      required: [true, 'Phone number is required'],
      validate: {
        validator: function (v) {
          return validator.isMobilePhone(v, 'any'); // Validates phone number for any locale
        },
        message: 'Invalid phone number',
      },
    },
    studentAddress: {
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
    role: {
      type: String,
      default: 'student',
    },
    marks: [
      {
        sub_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Course',
        },
        total: {
          type: Number,
          default: 0,
          min: [0, 'Marks cannot be less than 0'],
          max: [100, 'Marks cannot exceed 100'], // Adjust maximum as required
        },
      },
    ],
  },
  { timestamps: true }
);

StudentSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
})

StudentSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}


export default mongoose.model("Student", StudentSchema);