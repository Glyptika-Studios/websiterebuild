import { Router } from "express";
import { validate } from "../../middleware/validate.middleware.js";
import { requireRole } from "../../middleware/authorize.middleware.js";
import {
  createCategorySchema,
  updateCategorySchema,
  categoryIdSchema,
} from "../../validators/categories.validator.js";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../controllers/admin/categories.controller.js";

const router = Router();

router.route("/")
  .get(requireRole(["superadmin", "editor", "viewer"]), getCategories)
  .post(requireRole(["superadmin", "editor"]), validate(createCategorySchema), createCategory);

router.route("/:id")
  .get(
    requireRole(["superadmin", "editor", "viewer"]),
    validate(categoryIdSchema, "params"),
    getCategoryById
  )
  .put(
    requireRole(["superadmin", "editor"]),
    validate(categoryIdSchema, "params"),
    validate(updateCategorySchema),
    updateCategory
  )
  .delete(
    requireRole(["superadmin", "editor"]),
    validate(categoryIdSchema, "params"),
    deleteCategory
  );

export default router;
