import { supabasePublic } from "../../config/supabase.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";

export const createProposal = asyncHandler(async (req, res) => {
  const { service_ids, product_ids, project_ids, ...proposalData } = req.validated;

  const { data: proposalId, error: pErr } = await supabasePublic.rpc(
    "submit_proposal",
    {
      p_name: proposalData.name,
      p_email: proposalData.email,
      p_phone: proposalData.phone ?? null,
      p_company: proposalData.company ?? null,
      p_subject: proposalData.subject ?? null,
      p_message: proposalData.message ?? null,

      p_budget_type: proposalData.budget_type ?? null,
      p_budget_min: proposalData.budget_min ?? null,
      p_budget_max: proposalData.budget_max ?? null,
      p_budget_label: proposalData.budget_label ?? null,

      p_source_product_id: proposalData.source_product_id ?? null,
      p_source_service_id: proposalData.source_service_id ?? null,
      p_source_project_id: proposalData.source_project_id ?? null,

      p_priority: proposalData.priority ?? "normal",
      p_source_channel: proposalData.source_channel ?? null,

      p_service_ids: service_ids,
      p_product_ids: product_ids,
      p_project_ids: project_ids,
    }
  );

  if (pErr) {
    console.log("PROPOSAL ERROR:", pErr);
    throw new ApiError(500, pErr.message);
  }

  return res.status(201).json(
    new ApiResponse(
      201,
      { proposal_id: proposalId },
      "Proposal submitted successfully"
    )
  );
});