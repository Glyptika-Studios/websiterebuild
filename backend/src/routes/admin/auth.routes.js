import { Router } from "express";
import { validate } from "../../middleware/validate.middleware.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { limitAdminLogin } from "../../middleware/loginRateLimit.middleware.js";
import { loginSchema } from "../../validators/auth.validator.js";
import {
  loginAdmin,
  logoutAdmin,
  getAdminMe,
  updateAdminPassword,
} from "../../controllers/admin/auth.controller.js";

const router = Router();

router.post("/login", limitAdminLogin, validate(loginSchema), loginAdmin);
router.post("/logout", authenticate, logoutAdmin);
router.get("/me", authenticate, getAdminMe);
router.post("/update-password", updateAdminPassword);

export default router;
