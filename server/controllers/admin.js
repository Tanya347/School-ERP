import Admin from "../models/Admin.js";
import { catchAsync } from '../utils/catchAsync.js';


const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
      if(allowedFields.includes(el)) newObj[el] = obj[el];
    })
    return newObj;
  }
  
export const updateAdmin = catchAsync(async (req, res, next) => {
  
    // create error if user posts password data
    if (req.body.password) {
      return next(new AppError('This route is not for password updates. Please use /updatePassword.', 400));
    }
  
    const filteredBody = filterObj(req.body, 'username');
  
    const updatedUser = await Admin.findByIdAndUpdate(
      req.user.id,
      { $set: filteredBody},
      { new: true, runValidators: true }
    );
    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser
      },
      message: "Updated your admin profile successfully!"
    });
  });

  export const deleteAdmin = catchAsync(async (req, res, next) => {
    res.cookie('jwt', '', { expires: new Date(0), httpOnly: true });
    await Await.findByIdAndDelete(req.user.id);
    res.status(200).json({
      status: "success", 
      data: null,
      message: "Admin profile has been deleted!"
    });
  });