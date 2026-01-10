import Admin from "../models/Admin.js";

import { catchAsync } from '../utils/catchAsync.js';
import { successMsg } from "../utils/constants.js";
import { AppError } from "../utils/customError.js";


// filter object to allow only specified fields
// -----------------------------------------------
const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
      if(allowedFields.includes(el)) newObj[el] = obj[el];
    })
    return newObj;
  }


// update admin data
// -----------------------------------------------
export const updateAdmin = catchAsync(async (req, res, next) => {
  
    // create error if user posts password data
    if (req.body.password) {
      return next(new AppError('This route is not for password updates. Please use /updatePassword.', 400));
    }
  
    const filteredBody = filterObj(req.body, 'username');
  
    const updatedUser = await Admin.findByIdAndUpdate(
      { _id: req.user.id, schoolID: req.user.schoolID },
      { $set: filteredBody },
      { new: true, runValidators: true }
    );
    res.status(200).json({
      status: successMsg,
      data: {
        user: updatedUser
      },
      message: "Updated your admin profile successfully!"
    });
  });


// delete admin profile
// -----------------------------------------------
  export const deleteAdmin = catchAsync(async (req, res, next) => {
    res.cookie('jwt', '', { expires: new Date(0), httpOnly: true });

    const count = await Admin.countDocuments({ schoolID: req.user.schoolID });
    if (count <= 1) {
      return next(new AppError("Cannot delete the only admin of a school", 400));
    }

    await Admin.findByIdAndDelete(req.user.id);
    res.status(200).json({
      status: successMsg, 
      data: null,
      message: "Admin profile has been deleted!"
    });
  });