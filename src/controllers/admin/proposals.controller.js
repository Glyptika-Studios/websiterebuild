import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { parsePagination } from "../../utils/pagination.js";

export const getAdminProposals = asyncHandler(async (req, res) => {
  const { status, priority, source_channel, search } = req.query;

  const { page, limit, from, to } = parsePagination(req.query);

  let query = req.supabase
    .from("proposals")
    .select("*", { count: "exact" });

  if (status) query = query.eq("status", status);
  if (priority) query = query.eq("priority", priority);
  if (source_channel) query = query.eq("source_channel", source_channel);
  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  query = query.order("created_at", { ascending: false }).range(from, to);

  const { data, error, count } = await query;
  if (error) throw new ApiError(500, error.message);

  const resultData = {
    proposals: data,
    pagination: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit),
    },
  };

  return res.status(200).json(new ApiResponse(200, resultData, "Admin proposals retrieved successfully"));
});

export const getAdminProposalById = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const { data: proposal, error: pErr } = await req.supabase
    .from("proposals")
    .select("*")
    .eq("id", id)
    .single();

  if (pErr) {
    if (pErr.code === "PGRST116") throw new ApiError(404, "Proposal not found");
    throw new ApiError(500, pErr.message);
  }

  const [svcRes, prodRes, projRes] = await Promise.all([
    req.supabase
      .from("proposal_services")
      .select("service:services(id, title)")
      .eq("proposal_id", id),
    req.supabase
      .from("proposal_products")
      .select("product:products(id, title)")
      .eq("proposal_id", id),
    req.supabase
      .from("proposal_projects")
      .select("project:projects(id, title)")
      .eq("proposal_id", id),
  ]);

  proposal.services = (svcRes.data || []).map((r) => r.service);
  proposal.products = (prodRes.data || []).map((r) => r.product);
  proposal.projects = (projRes.data || []).map((r) => r.project);

  return res.status(200).json(new ApiResponse(200, proposal, "Proposal details retrieved successfully"));
});

export const updateAdminProposal = asyncHandler(async (req, res) => {
  const updateData = { ...req.validated };

  if (updateData.status && updateData.status !== "new") {
    updateData.reviewed_by = req.user.id;
    updateData.reviewed_at = new Date().toISOString();
  }

  const { data, error } = await req.supabase
    .from("proposals")
    .update(updateData)
    .eq("id", req.params.id)
    .select()
    .single();

  if (error) {
    if (error.code === "PGRST116") throw new ApiError(404, "Proposal not found");
    throw new ApiError(500, error.message);
  }

  return res.status(200).json(new ApiResponse(200, data, "Proposal updated successfully"));
});

export const deleteAdminProposal = asyncHandler(async (req, res) => {
  const { data, error } = await req.supabase
    .from("proposals")
    .delete()
    .eq("id", req.params.id)
    .select("id")
    .single();

  if (error) {
    if (error.code === "PGRST116") throw new ApiError(404, "Proposal not found");
    throw new ApiError(500, error.message);
  }

  return res.status(200).json(new ApiResponse(200, { id: data.id, deleted: true }, "Proposal deleted successfully"));
});
