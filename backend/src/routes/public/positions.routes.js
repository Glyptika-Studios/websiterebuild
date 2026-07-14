import { Router } from "express";
import {
  getPositions,
  getPositionById,
} from "../../controllers/public/positions.controller.js";

const router = Router();

router.get("/", getPositions);
router.get("/:id", getPositionById);

export default router;