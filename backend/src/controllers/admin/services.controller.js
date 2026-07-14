import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { supabaseAdmin } from "../../config/supabase.js";

// Valid url_type values from service_url_type ENUM
const VALID_URL_TYPES = ["internal", "external"];

// Audit log helper
async function logAudit(user, action, entity, entityId, metadata = null) {
  try {
    await supabaseAdmin.from("audit_logs").insert({
      user_id:    user.id,
      user_email: user.email,
      user_name:  user.user_metadata?.name || user.email,
      action,
      entity,
      entity_id:  String(entityId),
      metadata,
    });
  } catch (e) {
    console.error("Audit log failed:", e.message);
  }
}

// ── GET /api/v1/admin/services ────────────────────────────────
// Returns all services including inactive ones (admin sees all)
// Public endpoint only returns active=true
export const getServices = asyncHandler(async (req, res) => {
  const page   = Math.max(1, parseInt(req.query.page)  || 1);
  const limit  = Math.min(100, Math.max(1, parseInt(req.query.limit) || 50));
  const from   = (page - 1) * limit;

  // Optional filters
  const active  = req.query.active;   // 'true' or 'false'
  const publish = req.query.publish;  // 'true' or 'false'

  let query = supabaseAdmin
    .from("services")
    .select(
      "id, title, description, url, url_type, active, publish, display_order, created_at, updated_at, bg_image_id, icon_image_id",
      { count: "exact" }
    )
    .order("display_order", { ascending: true });

  if (active !== undefined) {
    query = query.eq("active", active === "true");
  }
  if (publish !== undefined) {
    query = query.eq("publish", publish === "true");
  }

  const { data, count, error } = await query.range(from, from + limit - 1);

  if (error) {
    throw new ApiError(500, "Failed to fetch services: " + error.message);
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      { items: data, meta: { page, limit, total: count } },
      "Services fetched successfully"
    )
  );
});

// ── GET /api/v1/admin/services/:id ───────────────────────────
export const getServiceById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabaseAdmin
    .from("services")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    throw new ApiError(404, "Service not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Service fetched successfully"));
});

// ── POST /api/v1/admin/services ───────────────────────────────
export const createService = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    url,
    url_type,
    active,
    publish,
    display_order,
    bg_image_id,
    icon_image_id,
  } = req.body;

  // url_type must be valid ENUM value
  if (url_type && !VALID_URL_TYPES.includes(url_type)) {
    throw new ApiError(
      400,
      `Invalid url_type. Must be one of: ${VALID_URL_TYPES.join(", ")}`
    );
  }

  // url is only required when url_type is 'external'
  // internal services have null url — the app builds the route from title/slug
  if (url_type === "external" && !url) {
    throw new ApiError(400, "url is required when url_type is external");
  }

  const { data, error } = await supabaseAdmin
    .from("services")
    .insert({
      title,
      description:   description || null,
      url:           url || null,
      url_type:      url_type || "internal",
      active:        active  ?? true,
      publish:       publish ?? false,
      display_order: display_order ?? 0,
      bg_image_id:   bg_image_id   || null,
      icon_image_id: icon_image_id || null,
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new ApiError(409, "A service with this title already exists");
    }
    if (error.code === "23514") {
      throw new ApiError(400, "URL must start with https://");
    }
    if (error.message?.includes("invalid input value for enum")) {
      throw new ApiError(400, "Invalid url_type value");
    }
    throw new ApiError(500, "Failed to create service: " + error.message);
  }

  await logAudit(req.user, "CREATE", "services", data.id, { title });

  return res
    .status(201)
    .json(new ApiResponse(201, data, "Service created successfully"));
});

// ── PUT /api/v1/admin/services/:id ───────────────────────────
export const updateService = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    url,
    url_type,
    active,
    publish,
    display_order,
    bg_image_id,
    icon_image_id,
  } = req.body;

  // Check exists
  const { data: existing, error: fetchError } = await supabaseAdmin
    .from("services")
    .select("id, title, url, url_type")
    .eq("id", id)
    .single();

  if (fetchError || !existing) {
    throw new ApiError(404, "Service not found");
  }

  // url_type validation
  if (url_type && !VALID_URL_TYPES.includes(url_type)) {
    throw new ApiError(
      400,
      `Invalid url_type. Must be one of: ${VALID_URL_TYPES.join(", ")}`
    );
  }

  const finalUrlType = url_type ?? existing.url_type;
  const finalUrl = url !== undefined ? url : existing.url;

  if (finalUrlType === "external" && !finalUrl) {
    throw new ApiError(400, "url is required when url_type is external");
  }

  // Build update object — only include fields that were sent
  const updates = {};
  if (title         !== undefined) updates.title         = title;
  if (description   !== undefined) updates.description   = description || null;
  if (url           !== undefined) updates.url           = url || null;
  if (url_type      !== undefined) updates.url_type      = url_type;
  if (active        !== undefined) updates.active        = active;
  if (publish       !== undefined) updates.publish       = publish;
  if (display_order !== undefined) updates.display_order = display_order;
  if (bg_image_id   !== undefined) updates.bg_image_id   = bg_image_id || null;
  if (icon_image_id !== undefined) updates.icon_image_id = icon_image_id || null;

  const { data, error } = await supabaseAdmin
    .from("services")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new ApiError(409, "A service with this title already exists");
    }
    if (error.code === "23514") {
      throw new ApiError(400, "URL must start with https://");
    }
    throw new ApiError(500, "Failed to update service: " + error.message);
  }

  await logAudit(req.user, "UPDATE", "services", id, updates);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Service updated successfully"));
});

// ── DELETE /api/v1/admin/services/:id ────────────────────────
export const deleteService = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check exists and get title for audit log
  const { data: existing, error: fetchError } = await supabaseAdmin
    .from("services")
    .select("id, title")
    .eq("id", id)
    .single();

  if (fetchError || !existing) {
    throw new ApiError(404, "Service not found");
  }

  const { error } = await supabaseAdmin
    .from("services")
    .delete()
    .eq("id", id);

  if (error) {
    if (error.code === "23503") {
      throw new ApiError(
        409,
        "Cannot delete this service — it is referenced by existing proposals. Remove it from all proposals first."
      );
    }
    throw new ApiError(500, "Failed to delete service: " + error.message);
  }

  await logAudit(req.user, "DELETE", "services", id, {
    title: existing.title,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { id }, "Service deleted successfully"));
});

// ── PATCH /api/v1/admin/services/reorder ─────────────────────
// Receives an array of { id, display_order } and updates all rows.
// All updates run sequentially — if any fail the others still run.
// For atomic all-or-nothing reorder, a DB transaction RPC would
// be needed — for display order changes this is acceptable.
export const reorderServices = asyncHandler(async (req, res) => {
  const { items } = req.body;
  // items = [{ id: "uuid", display_order: 1 }, ...]

  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, "items must be a non-empty array");
  }

  // Run all updates in parallel
  const updates = await Promise.all(
    items.map(({ id, display_order }) =>
      supabaseAdmin
        .from("services")
        .update({ display_order })
        .eq("id", id)
        .select("id, display_order")
        .single()
    )
  );

  // Check if any failed
  const failed = updates.filter((r) => r.error);
  if (failed.length > 0) {
    throw new ApiError(
      500,
      `Reorder partially failed: ${failed[0].error.message}`
    );
  }

  await logAudit(req.user, "UPDATE", "services", "reorder", {
    count: items.length,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updates.map((r) => r.data),
        "Services reordered successfully"
      )
    );
});
