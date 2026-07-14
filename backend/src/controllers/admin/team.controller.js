import { supabaseAdmin } from "../../config/supabase.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { parsePagination } from "../../utils/pagination.js";
import { recordAuditLog } from "../../utils/auditLog.js";
import { toIlikePattern } from "../../utils/queryFilters.js";

const TEAM_SELECT =
  "id, name, bio, linkedin_url, display_order, active, created_at, updated_at, " +
  "position:positions(id, title, department), " +
  "photo:media_files(id, public_url, file_name)";

async function getMemberByIdOrThrow(id) {
  const { data, error } = await supabaseAdmin
    .from("team_members")
    .select(TEAM_SELECT)
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") throw new ApiError(404, "Team member not found");
    throw new ApiError(500, error.message);
  }

  return data;
}

export const getTeamMembers = asyncHandler(async (req, res) => {
  const { active, search } = req.query;
  const { page, limit, from, to } = parsePagination(req.query);

  let query = supabaseAdmin
    .from("team_members")
    .select(TEAM_SELECT, { count: "exact" });

  if (active === "true" || active === "false") {
    query = query.eq("active", active === "true");
  }

  const searchPattern = toIlikePattern(search);
  if (searchPattern) query = query.ilike("name", searchPattern);

  query = query
    .order("display_order", { ascending: true })
    .order("name", { ascending: true })
    .range(from, to);

  const { data, error, count } = await query;
  if (error) throw new ApiError(500, error.message);

  return res.status(200).json(
    new ApiResponse(
      200,
      { items: data, meta: { page, limit, total: count } },
      "Team members retrieved successfully"
    )
  );
});

export const createTeamMember = asyncHandler(async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from("team_members")
    .insert(req.validated)
    .select(TEAM_SELECT)
    .single();

  if (error) {
    if (error.code === "23503") {
      throw new ApiError(400, "Invalid position_id or photo_id — referenced record does not exist");
    }
    throw new ApiError(500, error.message);
  }

  await recordAuditLog({
    user: req.user,
    action: "CREATE",
    entity: "team_members",
    entityId: data.id,
    metadata: { name: data.name },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, data, "Team member created successfully"));
});

export const updateTeamMember = asyncHandler(async (req, res) => {
  await getMemberByIdOrThrow(req.params.id);

  const { data, error } = await supabaseAdmin
    .from("team_members")
    .update(req.validated)
    .eq("id", req.params.id)
    .select(TEAM_SELECT)
    .single();

  if (error) {
    if (error.code === "23503") {
      throw new ApiError(400, "Invalid position_id or photo_id — referenced record does not exist");
    }
    throw new ApiError(500, error.message);
  }

  await recordAuditLog({
    user: req.user,
    action: "UPDATE",
    entity: "team_members",
    entityId: data.id,
    metadata: req.validated,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Team member updated successfully"));
});

export const deleteTeamMember = asyncHandler(async (req, res) => {
  const member = await getMemberByIdOrThrow(req.params.id);

  const { error } = await supabaseAdmin
    .from("team_members")
    .delete()
    .eq("id", member.id);

  if (error) throw new ApiError(500, error.message);

  await recordAuditLog({
    user: req.user,
    action: "DELETE",
    entity: "team_members",
    entityId: member.id,
    metadata: { name: member.name },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { id: member.id }, "Team member deleted successfully"));
});

export const reorderTeamMembers = asyncHandler(async (req, res) => {
  const { order } = req.validated;

  const updates = order.map(({ id, display_order }) =>
    supabaseAdmin
      .from("team_members")
      .update({ display_order })
      .eq("id", id)
  );

  const results = await Promise.all(updates);

  for (const { error } of results) {
    if (error) throw new ApiError(500, error.message);
  }

  await recordAuditLog({
    user: req.user,
    action: "UPDATE",
    entity: "team_members",
    entityId: null,
    metadata: { reordered_count: order.length },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { updated: order.length }, "Team order updated successfully"));
});