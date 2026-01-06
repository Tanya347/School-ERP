import express from "express";

import {
    logout,
    protect,
    registerAdmin,
    login,
    forgotPassword,
    resetPassword
} from "../controllers/auth.js";

import Student from "../models/Student.js";
import Admin from "../models/Admin.js";
import Faculty from "../models/Faculty.js";
import { roles } from "../utils/constants.js";

const router = express.Router();

router.post("/registerAdmin", registerAdmin);
router.post("/loginAdmin", login(Admin));
router.post("/loginFaculty", login(Faculty));
router.post("/loginStudent", login(Student));
router.post("/logout", protect(), logout);
router.post('/forgotPassword/student', forgotPassword(Student, roles.student));
router.post('/forgotPassword/faculty', forgotPassword(Faculty, roles.faculty));
router.patch('/resetPassword/student/:token', resetPassword(Student));
router.patch('/resetPassword/faculty/:token', resetPassword(Faculty));
router.post('/validate', protect(), (req, res) => {
    res.status(200).json({ status: successMsg, user: req.user });
});

export default router;