import express from "express";
import {
  createQuery,
  deleteQuery,
  getQuery,
  getQuerys,
  updateQuery,
} from "../controllers/queries.js";
import { protect } from "../controllers/auth.js";

const router = express.Router();

router.post("/", protect(), createQuery);
router.put("/:id", protect(), updateQuery);
router.delete("/:id", protect(), deleteQuery);
router.get("/:id", protect(), getQuery);
router.get("/", protect(), getQuerys);

export default router;
