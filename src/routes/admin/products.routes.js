import { Router } from "express";
import { validate } from "../../middleware/validate.middleware.js";
import { requireRole } from "../../middleware/authorize.middleware.js";
import {
  createProductSchema,
  createProductModuleSchema,
  productStatusSchema,
  reorderProductModulesSchema,
  updateProductSchema,
  updateProductModuleSchema,
} from "../../validators/products.validator.js";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStatus,
  getProductModules,
  createProductModule,
  updateProductModule,
  deleteProductModule,
  reorderProductModules,
} from "../../controllers/admin/products.controller.js";

const router = Router();

router
  .route("/")
  .get(requireRole(["superadmin", "editor", "viewer"]), getProducts)
  .post(requireRole(["superadmin", "editor"]), validate(createProductSchema), createProduct);

router
  .patch("/:id/status", requireRole(["superadmin", "editor"]), validate(productStatusSchema), updateProductStatus)
  .get("/:id/modules", requireRole(["superadmin", "editor", "viewer"]), getProductModules)
  .post("/:id/modules", requireRole(["superadmin", "editor"]), validate(createProductModuleSchema), createProductModule)
  .patch(
    "/:id/modules/reorder",
    requireRole(["superadmin", "editor"]),
    validate(reorderProductModulesSchema),
    reorderProductModules
  )
  .put(
    "/:id/modules/:mid",
    requireRole(["superadmin", "editor"]),
    validate(updateProductModuleSchema),
    updateProductModule
  )
  .delete("/:id/modules/:mid", requireRole(["superadmin", "editor"]), deleteProductModule);

router
  .route("/:id")
  .get(requireRole(["superadmin", "editor", "viewer"]), getProductById)
  .put(requireRole(["superadmin", "editor"]), validate(updateProductSchema), updateProduct)
  .delete(requireRole(["superadmin", "editor"]), deleteProduct);

export default router;
