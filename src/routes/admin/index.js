import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";

import postsRoutes from "./posts.routes.js";
import proposalsRoutes from "./proposals.routes.js";
import mediaRoutes from "./media.routes.js";
import tagsRouter from "./tags.routes.js";
import socialLinksRouter from "./socialLinks.routes.js";
import categoriesRouter from "./categories.routes.js";

const router = Router();
router.use(authenticate);

router.use("/posts", postsRoutes);
router.use("/proposals", proposalsRoutes);
router.use("/media", mediaRoutes);
router.use("/tags", tagsRouter);
router.use("/social-links", socialLinksRouter);
router.use("/categories", categoriesRouter);

export default router;
