import { Router } from "express";
import { validate } from "../../middleware/validate.middleware.js";
import { requireRole } from "../../middleware/authorize.middleware.js";
import {
  getSocialLinks,
  upsertSocialLink,
  deleteSocialLink,
} from "../../controllers/admin/socialLinks.controller.js";
import { upsertSocialLinkSchema } from "../../validators/socialLinks.validator.js";

const router = Router();

router.route("/")
  .get(requireRole(["superadmin", "editor", "viewer"]), getSocialLinks);

router.route("/:platform")
  .put(requireRole(["superadmin", "editor"]), validate(upsertSocialLinkSchema), upsertSocialLink)
  .delete(requireRole(["superadmin", "editor"]), deleteSocialLink);

export default router;
