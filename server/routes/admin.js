import express from "express";
import {
  deleteAdmin,
  updateAdmin,
} from "../controllers/admin.js";
import Admin from "../models/Admin.js";
import {protect, isOwner, restrictTo} from "../controllers/auth.js"

const router = express.Router();


router.put("/:id", protect(), isOwner(Admin), restrictTo("admin"), updateAdmin);
router.delete("/", protect(), isOwner(Admin), restrictTo("admin"), deleteAdmin)

export default router;
