import express from "express";
import {
  createQuery,
  deleteQuery,
  getQuery,
  getQuerys,
  updateQuery,
} from "../controllers/queries.js";

const router = express.Router();

router.post("/", createQuery);
router.put("/:id", updateQuery);
router.delete("/:id", deleteQuery);
router.get("/:id", getQuery);
router.get("/", getQuerys);

export default router;
