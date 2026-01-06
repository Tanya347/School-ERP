import express from "express";

import {
  deleteAdmin,
  updateAdmin,
} from "../controllers/admin.js";

import Admin from "../models/Admin.js";
import {protect, isOwner, restrictTo, updatePassword} from "../controllers/auth.js"
import { roles } from "../utils/constants.js";

const router = express.Router();


router.put("/:id", protect(), isOwner(Admin), restrictTo(roles.admin), updateAdmin);
router.delete("/", protect(), isOwner(Admin), restrictTo(roles.admin), deleteAdmin)
router.patch("/updatePassword/:id", protect(), restrictTo(roles.admin), updatePassword(Admin));
export default router;
