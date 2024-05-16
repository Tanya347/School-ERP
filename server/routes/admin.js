import express from "express";
import {
  registerAdmin,
  loginAdmin,
  updateAdmin,
} from "../controllers/admin.js";

const router = express.Router();

router.post("/registerAdmin", registerAdmin);
router.post("/loginAdmin", loginAdmin);
router.put("/:id", updateAdmin);

export default router;
