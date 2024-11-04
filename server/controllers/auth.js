import Admin from "../models/Admin.js";
import Student from "../models/Student.js"
import Faculty from "../models/Faculty.js"
import jwt from "jsonwebtoken";
import {promisify} from 'util';
import { catchAsync } from "../utils/catchAsync.js";
const USER_MODELS = [Admin, Student, Faculty];
import { AppError } from "../utils/customError.js";

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
}

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
    status: 'success',
    token,
    user
  })
}

export const registerAdmin = catchAsync(async (req, res, next) => {
  const newUser = await Admin.create({
    username: req.body.username,
    password: req.body.password,
    role: req.body.role
  })
  createSendToken(newUser, 201, res);
})

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
    return next(new AppError('Token is invalid or has expired.', 401));
  }
})

export const restrictTo = (...roles) => {
  return catchAsync(async (req, res, next) => {
    if(!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  })
}

export const logout = catchAsync(async (req, res, next) => {
  res.cookie('jwt', '', { expires: new Date(0), httpOnly: true });
  res.status(200).json({
    status: 'success', 
    message: "Successfully logged out"
  })
})

export const updatePassword = (model) => catchAsync(async(req, res, next) => {
  const user = await model.findById(req.user.id).select('+password');
  if(!(await user.correctPassword(req.body.password, user.password))) {
    return next(new AppError('The password provided is incorrect.', 401));
  }
  user.password = req.body.password;
  await user.save();
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    user,
    token
  })
})

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


