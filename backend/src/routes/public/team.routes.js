import { Router } from "express";
import { getTeam } from "../../controllers/public/team.controller.js";

const router = Router();

router.get("/", getTeam);

export default router;
