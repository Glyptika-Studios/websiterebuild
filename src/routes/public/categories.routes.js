import { Router } from "express";
import { getCategories } from "../../controllers/public/categories.controller.js";

const router = Router();

router.get("/", getCategories);

export default router;
