import { supabaseAdmin } from "../../config/supabase.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { parsePagination } from "../../utils/pagination.js";
import { buildIlikeOrFilter, toIlikePattern } from "../../utils/queryFilters.js";

function applyAuditFilters(query, filters) {
  const {
    action,
    entity,
    entity_id,  
    user_id,
    user_email,
    from_date,
    to_date,
    search,
  } = filters;

  if (action) query = query.eq("action", action);
  if (entity) query = query.eq("entity", entity);
  if (entity_id) query = query.eq("entity_id", entity_id);
  if (user_id) query = query.eq("user_id", user_id);
  const userEmailPattern = toIlikePattern(user_email);
  if (userEmailPattern) query = query.ilike("user_email", userEmailPattern);
  if (from_date) query = query.gte("created_at", from_date);
  if (to_date) query = query.lte("created_at", to_date);
  const searchFilter = buildIlikeOrFilter(
    ["entity", "entity_id", "user_email", "user_name"],
    search
  );
  if (searchFilter) query = query.or(searchFilter);

  return query;
}

export const getAuditLogs = asyncHandler(async (req, res) => {
  const { page, limit, from, to } = parsePagination(req.query, {
    defaultLimit: 25,
    maxLimit: 100,
  });

  let query = supabaseAdmin
    .from("audit_logs")
    .select("*", { count: "exact" });

  query = applyAuditFilters(query, req.query);
  query = query.order("created_at", { ascending: false }).range(from, to);

  const { data, error, count } = await query;

  if (error) {
    throw new ApiError(500, "Failed to fetch audit logs: " + error.message);
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      { items: data, meta: { page, limit, total: count, totalPages: Math.ceil((count || 0) / limit) } },
      "Audit logs retrieved successfully"
    )
  );
});

export const getAuditLogById = asyncHandler(async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from("audit_logs")
    .select("*")
    .eq("id", req.params.id)
    .single();

  if (error) {
    if (error.code === "PGRST116") throw new ApiError(404, "Audit log not found");
    throw new ApiError(500, "Failed to fetch audit log: " + error.message);
  }

  return res.status(200).json(
    new ApiResponse(200, data, "Audit log retrieved successfully")
  );
});
