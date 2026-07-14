import { Router } from "express";
import { validate } from "../../middleware/validate.middleware.js";
import { createProposalSchema } from "../../validators/proposals.validator.js";
import { createProposal } from "../../controllers/public/proposals.controller.js";

const router = Router();

router.post("/", validate(createProposalSchema), createProposal);

export default router;
