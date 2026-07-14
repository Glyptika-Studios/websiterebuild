import { Router } from "express";
import { getPageContent } from "../../controllers/public/pageContent.controller.js";

const router = Router();

router.get("/:key", getPageContent);

export default router;