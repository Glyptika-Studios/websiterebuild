import { Router } from "express";
import healthRoutes from "./health.routes.js";
import postsRoutes from "./posts.routes.js";
import proposalsRoutes from "./proposals.routes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/posts", postsRoutes);
router.use("/proposals", proposalsRoutes);

export default router;
