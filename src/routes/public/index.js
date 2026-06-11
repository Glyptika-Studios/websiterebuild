import { Router } from "express";
import healthRoutes from "./health.routes.js";
import postsRoutes from "./posts.routes.js";
import proposalsRoutes from "./proposals.routes.js";
import categoriesRoutes from "./categories.routes.js";
import tagsRoutes from "./tags.routes.js";
import servicesRoutes from "./services.routes.js";
import productsRoutes from "./products.routes.js";
import projectsRoutes from "./projects.routes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/posts", postsRoutes);
router.use("/proposals", proposalsRoutes);
router.use("/categories", categoriesRoutes);
router.use("/tags", tagsRoutes);
router.use("/services", servicesRoutes);
router.use("/products", productsRoutes);
router.use("/projects", projectsRoutes);

export default router;
