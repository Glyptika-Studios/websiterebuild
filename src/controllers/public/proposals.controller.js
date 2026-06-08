import { supabasePublic } from "../../config/supabase.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";

export const createProposal = asyncHandler(async (req, res) => {
  const { service_ids, product_ids, project_ids, ...proposalData } = req.validated;

  const { data: proposal, error: pErr } = await supabasePublic
    .from("proposals")
    .insert(proposalData)
    .select()
    .single();

  if (pErr) throw new ApiError(500, pErr.message);

  if (service_ids.length) {
    const rows = service_ids.map((sid) => ({
      proposal_id: proposal.id,
      service_id: sid,
    }));
    const { error } = await supabasePublic.from("proposal_services").insert(rows);
    if (error) throw new ApiError(500, error.message);
  }

  if (product_ids.length) {
    const rows = product_ids.map((pid) => ({
      proposal_id: proposal.id,
      product_id: pid,
    }));
    const { error } = await supabasePublic.from("proposal_products").insert(rows);
    if (error) throw new ApiError(500, error.message);
  }

  if (project_ids.length) {
    const rows = project_ids.map((pid) => ({
      proposal_id: proposal.id,
      project_id: pid,
    }));
    const { error } = await supabasePublic.from("proposal_projects").insert(rows);
    if (error) throw new ApiError(500, error.message);
  }

  return res.status(201).json(new ApiResponse(201, proposal, "Proposal submitted successfully"));
});
