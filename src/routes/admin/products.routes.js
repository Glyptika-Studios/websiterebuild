import { Router } from "express";
import { validate } from "../../middleware/validate.middleware.js";
import { requireRole } from "../../middleware/authorize.middleware.js";
import {
  createProductSchema,
  updateProductSchema,
} from "../../validators/products.validator.js";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../controllers/admin/products.controller.js";

const router = Router();

router
  .route("/")
  .get(requireRole(["superadmin", "editor", "viewer"]), getProducts)
  .post(requireRole(["superadmin", "editor"]), validate(createProductSchema), createProduct);

router
  .route("/:id")
  .get(requireRole(["superadmin", "editor", "viewer"]), getProductById)
  .put(requireRole(["superadmin", "editor"]), validate(updateProductSchema), updateProduct)
  .delete(requireRole(["superadmin", "editor"]), deleteProduct);

export default router;
