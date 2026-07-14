import { Router } from "express";
import { getHealth } from "../../controllers/public/health.controller.js";

const router = Router();

router.get("/", getHealth);

export default router;
