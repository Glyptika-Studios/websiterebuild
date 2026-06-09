import { supabasePublic } from "../../config/supabase.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";

async function insertProposalLinks(table, foreignKey, proposalId, ids) {
  if (!ids.length) return;

  const rows = ids.map((id) => ({
    proposal_id: proposalId,
    [foreignKey]: id,
  }));

  const { error } = await supabasePublic.from(table).insert(rows);
  if (error) throw new ApiError(500, error.message);
}

export const createProposal = asyncHandler(async (req, res) => {
  const { service_ids, product_ids, project_ids, ...proposalData } = req.validated;

  const { data: proposal, error: pErr } = await supabasePublic
    .from("proposals")
    .insert(proposalData)
    .select()
    .single();

  if (pErr) throw new ApiError(500, pErr.message);

  try {
    await insertProposalLinks("proposal_services", "service_id", proposal.id, service_ids);
    await insertProposalLinks("proposal_products", "product_id", proposal.id, product_ids);
    await insertProposalLinks("proposal_projects", "project_id", proposal.id, project_ids);
  } catch (error) {
    await supabasePublic.from("proposals").delete().eq("id", proposal.id);
    throw error;
  }

  return res.status(201).json(new ApiResponse(201, proposal, "Proposal submitted successfully"));
});
