import { Router } from "express";
import { getTags } from "../../controllers/public/tags.controller.js";

const router = Router();

router.get("/", getTags);

export default router;
