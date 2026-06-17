import { Router } from "express";
import { validate } from "../../middleware/validate.middleware.js";
import { requireRole } from "../../middleware/authorize.middleware.js";
import {
  addProductMediaSchema,
  createProductSchema,
  createProductModuleSchema,
  productIdParamsSchema,
  productMediaParamsSchema,
  productModuleParamsSchema,
  productStatusSchema,
  reorderProductMediaSchema,
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
  addProductMedia,
  deleteProductMedia,
  reorderProductMedia,
} from "../../controllers/admin/products.controller.js";

const router = Router();

router
  .route("/")
  .get(requireRole(["superadmin", "editor", "viewer"]), getProducts)
  .post(requireRole(["superadmin", "editor"]), validate(createProductSchema), createProduct);

router
  .patch(
    "/:id/status",
    requireRole(["superadmin", "editor"]),
    validate(productIdParamsSchema, "params"),
    validate(productStatusSchema),
    updateProductStatus
  )
  .post(
    "/:id/media",
    requireRole(["superadmin", "editor"]),
    validate(productIdParamsSchema, "params"),
    validate(addProductMediaSchema),
    addProductMedia
  )
  .delete(
    "/:id/media/:emid",
    requireRole(["superadmin", "editor"]),
    validate(productMediaParamsSchema, "params"),
    deleteProductMedia
  )
  .patch(
    "/:id/media/reorder",
    requireRole(["superadmin", "editor"]),
    validate(productIdParamsSchema, "params"),
    validate(reorderProductMediaSchema),
    reorderProductMedia
  )
  .get(
    "/:id/modules",
    requireRole(["superadmin", "editor", "viewer"]),
    validate(productIdParamsSchema, "params"),
    getProductModules
  )
  .post(
    "/:id/modules",
    requireRole(["superadmin", "editor"]),
    validate(productIdParamsSchema, "params"),
    validate(createProductModuleSchema),
    createProductModule
  )
  .patch(
    "/:id/modules/reorder",
    requireRole(["superadmin", "editor"]),
    validate(productIdParamsSchema, "params"),
    validate(reorderProductModulesSchema),
    reorderProductModules
  )
  .put(
    "/:id/modules/:mid",
    requireRole(["superadmin", "editor"]),
    validate(productModuleParamsSchema, "params"),
    validate(updateProductModuleSchema),
    updateProductModule
  )
  .delete(
    "/:id/modules/:mid",
    requireRole(["superadmin", "editor"]),
    validate(productModuleParamsSchema, "params"),
    deleteProductModule
  );

router
  .route("/:id")
  .get(
    requireRole(["superadmin", "editor", "viewer"]),
    validate(productIdParamsSchema, "params"),
    getProductById
  )
  .put(
    requireRole(["superadmin", "editor"]),
    validate(productIdParamsSchema, "params"),
    validate(updateProductSchema),
    updateProduct
  )
  .delete(
    requireRole(["superadmin", "editor"]),
    validate(productIdParamsSchema, "params"),
    deleteProduct
  );

export default router;