import express from "express";
import {
    logout,
    protect,
    registerAdmin,
    login
} from "../controllers/auth.js";
import Student from "../models/Student.js";
import Admin from "../models/Admin.js";
import Faculty from "../models/Faculty.js";

const router = express.Router();

router.post("/registerAdmin", registerAdmin);
router.post("/loginAdmin", login(Admin));
router.post("/loginFaculty", login(Faculty));
router.post("/loginStudent", login(Student));
router.post("/logout", protect(), logout);
router.post('/validate', protect(), (req, res) => {
    res.status(200).json({ status: 'success', user: req.user });
});

export default router;