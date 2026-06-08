import { Router } from "express";
import { getPosts, getPostBySlug, getPostById } from "../../controllers/public/posts.controller.js";

const router = Router();

router.get("/", getPosts);
router.get("/slug/:slug", getPostBySlug);
router.get("/:id", getPostById);

export default router;
