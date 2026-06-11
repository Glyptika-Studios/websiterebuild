import { Router } from "express";
import { validate } from "../../middleware/validate.middleware.js";
import { requireRole } from "../../middleware/authorize.middleware.js";
import { upsertSocialLinkSchema } from "../../validators/socialLinks.validator.js";
import {
  getSocialLinks,
  upsertSocialLink,
} from "../../controllers/admin/socialLinks.controller.js";

const router = Router();

router.route("/")
  .get(requireRole(["superadmin", "editor", "viewer"]), getSocialLinks);

router.route("/:platform")
  .put(requireRole(["superadmin", "editor"]), validate(upsertSocialLinkSchema), upsertSocialLink);

export default router;
