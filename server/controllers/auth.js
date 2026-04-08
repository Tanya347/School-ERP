import Admin from "../models/Admin.js";
import Student from "../models/Student.js"
import Faculty from "../models/Faculty.js"

import { successMsg } from "../utils/constants.js";

const USER_MODELS = [Admin, Student, Faculty];

import jwt from "jsonwebtoken";
import crypto from "crypto";
import { promisify } from 'util';

import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/customError.js";
import { sendEmail } from "../utils/email.js";


// sign token
// -----------------------------------------------
const signToken = id => {
  return jwt.sign({ id }, process.env.JWT, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
}


// create and send token
// -----------------------------------------------
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN*60*60*1000),
    httpOnly: true,
    sameSite: 'None',
    secure: true
  }
  if(process.env.NODE_ENV === 'production')
  cookieOptions.secure = true
  res.cookie('jwt', token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({
    status: successMsg,
    token,
    user
  })
}


// login
// -----------------------------------------------
export const login = (model) => catchAsync(async (req, res, next) => {

  const {username, password} = req.body;

  if(!username || !password) {
    return next(new AppError('Please provide both username and password', 400));
  }

  const user = await model.findOne({username}).select('+password');
  if(!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect username or password!', 401));
  }

  createSendToken(user, 200, res);
});


// protect routes
// -----------------------------------------------
export const protect = () => catchAsync(async(req, res, next) => {
  let token;

  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if(req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if(!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  try {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT);
    const userSearches = USER_MODELS.map(model => model.findById(decoded.id).exec());
    const results = await Promise.all(userSearches);
    const freshUser = results.find(user => user !== null);

    if(!freshUser ) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    req.user = freshUser ;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Token expired', 401));
    }
    return next(new AppError('Invalid token', 401));
  }
})


// restrict to specific roles
// -----------------------------------------------
export const restrictTo = (...roles) => {
  return catchAsync(async (req, res, next) => {
    if(!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  })
}


// logout
// -----------------------------------------------
export const logout = catchAsync(async (req, res, next) => {
  res.cookie('jwt', '', {
    expires: new Date(0),
    httpOnly: true,
    sameSite: 'None',
    secure: true
  });

  res.status(200).json({
    status: successMsg,
    message: 'Successfully logged out'
  });
});


// check if owner of resource
// -----------------------------------------------
export const isOwner = (model) => catchAsync(async (req, res, next) => {
  const resource = await model.findById(req.params.id);
  if(!resource) {
    return next(new AppError('Resource not found', 404));
  }
  if((resource.author && resource.author.toString() !== req.user.id) && (resource._id && resource._id.toString() !== req.user.id)) {
    return next(new AppError('You do not have permission to perform this action', 403));
  }
  next();
})


// forgot password
// -----------------------------------------------
export const forgotPassword = (model, type) => catchAsync(async(req, res, next) => {
  const user = await model.findOne({email: req.body.email});
  
  if(!user) {
    return next(new AppError("There is no user with email address", 404))
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({validateBeforeSave: false});

  const resetURL = `${process.env.CLIENT}/resetPassword/${type}/${resetToken}`;
  const message = `Forgot your password? Submit a patch request to: ${resetURL}.\nIf you didn't forget your password, please ignore this email`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token(valid for 10 min)',
      message
    })
    res.status(200).json({
      status: successMsg,
      message: 'Token sent to email'
    })
  } catch(err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({validateBeforeSave: false});

    return next(
      new AppError('There was an error sending the email. Try again later!', 500)
    )
  }
})


// reset password
// -----------------------------------------------
export const resetPassword = (model) => catchAsync(async(req, res, next) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await model.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: {$gt: Date.now()}
  });

  if(!user) {
    return next(new AppError('Token is invalid or has expired', 400))
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  const token = signToken(user._id);

  res.status(200).json({
    status: successMsg,
    token
  })
})


// update password
// -----------------------------------------------
export const updatePassword = (model) => catchAsync(async (req, res, next) => {

  const user = await model.findById(req.params.id).select('+password');
  if (!user) {
    return next(new AppError('No admin found with that ID.', 404));
  }

  if (!(await user.correctPassword(req.body.passwordConfirm, user.password))) {
    return next(new AppError('The password provided is incorrect.', 401));
  }

  user.password = req.body.password;
  await user.save();

  const token = signToken(user._id);

  res.status(200).json({
    status: successMsg,
    user,
    token
  });
});

