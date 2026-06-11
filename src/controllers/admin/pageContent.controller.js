import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { supabaseAdmin } from "../../config/supabase.js";

// Valid page keys from page_key ENUM
const VALID_PAGE_KEYS = ["home", "services", "xplor", "ims", "team"];

// Helper to validate page key from params
function validatePageKey(key) {
  if (!VALID_PAGE_KEYS.includes(key)) {
    throw new ApiError(
      400,
      `Invalid page key. Must be one of: ${VALID_PAGE_KEYS.join(", ")}`
    );
  }
}

// Helper for audit logging — failure must not fail the main request
async function logAudit(user, action, entity, entityId, metadata = null) {
  try {
    await supabaseAdmin.from("audit_logs").insert({
      user_id: user.id,
      user_email: user.email,
      user_name: user.user_metadata?.name || user.email,
      action,
      entity,
      entity_id: String(entityId),
      metadata,
    });
  } catch (e) {
    console.error("Audit log failed:", e.message);
  }
}

// ── GET /api/v1/admin/pages ───────────────────────────────────
// Returns all 5 page keys with their last updated timestamp
// Does not return full content — use getPageByKey for that
export const getPages = asyncHandler(async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from("page_content")
    .select("id, page, updated_at, updated_by")
    .order("page", { ascending: true });

  if (error) {
    throw new ApiError(500, "Failed to fetch pages: " + error.message);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Pages fetched successfully"));
});

// ── GET /api/v1/admin/pages/:key ──────────────────────────────
// Returns full content for a single page
export const getPageByKey = asyncHandler(async (req, res) => {
  const { key } = req.params;
  validatePageKey(key);

  const { data, error } = await supabaseAdmin
    .from("page_content")
    .select("id, page, content, updated_at, updated_by")
    .eq("page", key)
    .single();

  if (error || !data) {
    throw new ApiError(404, `Page '${key}' not found`);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Page fetched successfully"));
});

// ── PUT /api/v1/admin/pages/:key ──────────────────────────────
// Updates content for a page.
// The DB trigger fn_capture_page_version automatically snapshots
// the previous content into page_content_history before the update.
// No manual versioning needed here.
export const updatePage = asyncHandler(async (req, res) => {
  const { key } = req.params;
  const { content } = req.body;

  validatePageKey(key);

  // Check page exists
  const { data: existing, error: fetchError } = await supabaseAdmin
    .from("page_content")
    .select("id, page")
    .eq("page", key)
    .single();

  if (fetchError || !existing) {
    throw new ApiError(404, `Page '${key}' not found`);
  }

  // Update — trigger fn_capture_page_version fires automatically
  // and snapshots the old content into page_content_history
  const { data, error } = await supabaseAdmin
    .from("page_content")
    .update({
      content,
      updated_by: req.user.id,
      
    })
    .eq("page", key)
    .select("id, page, content, updated_at, updated_by")
    .single();

  if (error) {
    throw new ApiError(500, "Failed to update page: " + error.message);
  }

  await logAudit(req.user, "UPDATE", "page_content", key, {
    page: key,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Page updated successfully"));
});

// ── GET /api/v1/admin/pages/:key/history ─────────────────────
// Returns up to 20 most recent versions of a page
// The DB trigger keeps only the 20 most recent automatically
export const getPageHistory = asyncHandler(async (req, res) => {
  const { key } = req.params;
  validatePageKey(key);

  // Pagination
  const page  = Math.max(1, parseInt(req.query.page)  || 1);
  const limit = Math.min(20, Math.max(1, parseInt(req.query.limit) || 20));
  const from  = (page - 1) * limit;

  const { data, count, error } = await supabaseAdmin
    .from("page_content_history")
    .select("id, page, content, changed_by, changed_at", { count: "exact" })
    .eq("page", key)
    .order("changed_at", { ascending: false })
    .range(from, from + limit - 1);

  if (error) {
    throw new ApiError(
      500,
      "Failed to fetch page history: " + error.message
    );
  }

  return res.status(200).json(
    new ApiResponse(200, data, "Page history fetched successfully", {
      page,
      limit,
      total: count,
    })
  );
});