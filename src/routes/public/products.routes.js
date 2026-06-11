import { Router } from "express";
import { getProducts } from "../../controllers/public/products.controller.js";

const router = Router();

router.get("/", getProducts);

export default router;
