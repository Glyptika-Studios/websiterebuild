import { Router } from "express";
import { getSocialLinks } from "../../controllers/public/socialLinks.controller.js";

const router = Router();

router.get("/", getSocialLinks);

export default router;