import { Router } from "express";
import {
  getProjects,
  getProjectById,
} from "../../controllers/public/projects.controller.js";

const router = Router();

router.get("/", getProjects);
router.get("/:id", getProjectById);

export default router;