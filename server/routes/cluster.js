import express from "express";
import {
  createCluster, getClusters
} from "../controllers/cluster.js";

const router = express.Router();

router.post("/", createCluster);
router.get("/", getClusters);

export default router;
