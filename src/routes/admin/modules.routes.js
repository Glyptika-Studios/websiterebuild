import { Router } from "express";
import { validate } from "../../middleware/validate.middleware.js";
import { requireRole } from "../../middleware/authorize.middleware.js";
import {
  modulePricingParamsSchema,
  upsertModulePricingSchema,
} from "../../validators/products.validator.js";
import {
  upsertModulePricing,
  deleteModulePricing,
} from "../../controllers/admin/products.controller.js";

const router = Router();

router.put(
  "/:mid/pricing/:tier",
  requireRole(["superadmin", "editor"]),
  validate(modulePricingParamsSchema, "params"),
  validate(upsertModulePricingSchema),
  upsertModulePricing
);

router.delete(
  "/:mid/pricing/:tier",
  requireRole(["superadmin", "editor"]),
  validate(modulePricingParamsSchema, "params"),
  deleteModulePricing
);

export default router;