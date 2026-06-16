import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { supabaseAdmin } from "../../config/supabase.js";

// Valid ENUMs
const VALID_EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
];
const VALID_ITEM_KINDS = ["responsibility", "requirement", "benefit"];

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

// DB error handler
function handleDbError(error) {
  if (error.code === "23505")
    throw new ApiError(409, "A record with this value already exists");
  if (error.code === "23503")
    throw new ApiError(409, "Cannot delete — remove all references first");
  if (error.message?.includes("invalid input value for enum"))
    throw new ApiError(400, "Invalid ENUM value provided");
  throw new ApiError(500, "Database error: " + error.message);
}

// ════════════════════════════════════════════════════════════════
// POSITION ENDPOINTS
// ════════════════════════════════════════════════════════════════

// ── GET /api/v1/admin/positions ───────────────────────────────
export const getPositions = asyncHandler(async (req, res) => {
  const page   = Math.max(1, parseInt(req.query.page)  || 1);
  const limit  = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
  const from   = (page - 1) * limit;
  const active          = req.query.active;
  const department      = req.query.department;
  const employment_type = req.query.employment_type;

  // Validate employment_type filter if provided
  if (employment_type && !VALID_EMPLOYMENT_TYPES.includes(employment_type)) {
    throw new ApiError(
      400,
      `Invalid employment_type. Must be one of: ${VALID_EMPLOYMENT_TYPES.join(", ")}`
    );
  }

  let query = supabaseAdmin
    .from("positions")
    .select(
      "id, title, department, location, employment_type, description, active, created_at, updated_at",
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(from, from + limit - 1);

  if (active !== undefined)
    query = query.eq("active", active === "true");
  if (department)
    query = query.ilike("department", `%${department}%`);
  if (employment_type)
    query = query.eq("employment_type", employment_type);

  const { data, count, error } = await query;

  if (error)
    throw new ApiError(500, "Failed to fetch positions: " + error.message);

  return res.status(200).json(
    new ApiResponse(
      200,
      { items: data, meta: { page, limit, total: count } },
      "Positions fetched successfully"
    )
  );
});

// ── GET /api/v1/admin/positions/:id ──────────────────────────
// Returns position with all its items (responsibilities,
// requirements, benefits) in a single response
export const getPositionById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Fetch position
  const { data: position, error: posError } = await supabaseAdmin
    .from("positions")
    .select("*")
    .eq("id", id)
    .single();

  if (posError || !position)
    throw new ApiError(404, "Position not found");

  // Fetch all items for this position grouped by kind
  const { data: items, error: itemsError } = await supabaseAdmin
    .from("position_items")
    .select("id, kind, body, display_order")
    .eq("position_id", id)
    .order("kind", { ascending: true })
    .order("display_order", { ascending: true });

  if (itemsError)
    throw new ApiError(500, "Failed to fetch position items: " + itemsError.message);

  // Group items by kind for easier frontend consumption
  const grouped = {
    responsibilities: items.filter((i) => i.kind === "responsibility"),
    requirements:     items.filter((i) => i.kind === "requirement"),
    benefits:         items.filter((i) => i.kind === "benefit"),
  };

  return res.status(200).json(
    new ApiResponse(
      200,
      { ...position, items: grouped },
      "Position fetched successfully"
    )
  );
});

// ── POST /api/v1/admin/positions ──────────────────────────────
export const createPosition = asyncHandler(async (req, res) => {
  const {
    title,
    department,
    location,
    employment_type,
    description,
    active,
  } = req.validated;

  if (!VALID_EMPLOYMENT_TYPES.includes(employment_type)) {
    throw new ApiError(
      400,
      `Invalid employment_type. Must be one of: ${VALID_EMPLOYMENT_TYPES.join(", ")}`
    );
  }

  const { data, error } = await supabaseAdmin
    .from("positions")
    .insert({
      title,
      department,
      location,
      employment_type,
      description: description || null,
      active:      active ?? true,
    })
    .select("*")
    .single();

  if (error) handleDbError(error);

  await logAudit(req.user, "CREATE", "positions", data.id, {
    title,
    department,
    employment_type,
  });

  return res.status(201).json(
    new ApiResponse(201, data, "Position created successfully")
  );
});

// ── PUT /api/v1/admin/positions/:id ──────────────────────────
export const updatePosition = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    title,
    department,
    location,
    employment_type,
    description,
    active,
  } = req.validated;

  // Check exists
  const { data: existing, error: fetchError } = await supabaseAdmin
    .from("positions")
    .select("id")
    .eq("id", id)
    .single();

  if (fetchError || !existing)
    throw new ApiError(404, "Position not found");

  // Validate employment_type if provided
  if (employment_type && !VALID_EMPLOYMENT_TYPES.includes(employment_type)) {
    throw new ApiError(
      400,
      `Invalid employment_type. Must be one of: ${VALID_EMPLOYMENT_TYPES.join(", ")}`
    );
  }

  // Build update object with only provided fields
  const updates = {};
  if (title           !== undefined) updates.title           = title;
  if (department      !== undefined) updates.department      = department;
  if (location        !== undefined) updates.location        = location;
  if (employment_type !== undefined) updates.employment_type = employment_type;
  if (description     !== undefined) updates.description     = description;
  if (active          !== undefined) updates.active          = active;

  const { data, error } = await supabaseAdmin
    .from("positions")
    .update(updates)
    .eq("id", id)
    .select("*")
    .single();

  if (error) handleDbError(error);

  await logAudit(req.user, "UPDATE", "positions", id, updates);

  return res.status(200).json(
    new ApiResponse(200, data, "Position updated successfully")
  );
});

// ── DELETE /api/v1/admin/positions/:id ───────────────────────
// Cascades — DB ON DELETE CASCADE removes all position_items
export const deletePosition = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check exists and get title for audit log
  const { data: existing, error: fetchError } = await supabaseAdmin
    .from("positions")
    .select("id, title")
    .eq("id", id)
    .single();

  if (fetchError || !existing)
    throw new ApiError(404, "Position not found");

  const { error } = await supabaseAdmin
    .from("positions")
    .delete()
    .eq("id", id);

  if (error) {
    if (error.code === "23503")
      throw new ApiError(
        409,
        "Cannot delete this position — it is referenced by team members. Reassign them first."
      );
    throw new ApiError(500, "Failed to delete position: " + error.message);
  }

  await logAudit(req.user, "DELETE", "positions", id, {
    title: existing.title,
  });

  return res.status(200).json(
    new ApiResponse(200, { id }, "Position deleted successfully")
  );
});

// ════════════════════════════════════════════════════════════════
// POSITION ITEMS ENDPOINTS
// ════════════════════════════════════════════════════════════════

// ── GET /api/v1/admin/positions/:id/items ────────────────────
export const getPositionItems = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { kind } = req.query;

  // Validate kind filter if provided
  if (kind && !VALID_ITEM_KINDS.includes(kind)) {
    throw new ApiError(
      400,
      `Invalid kind. Must be one of: ${VALID_ITEM_KINDS.join(", ")}`
    );
  }

  // Check position exists
  const { data: position, error: posError } = await supabaseAdmin
    .from("positions")
    .select("id")
    .eq("id", id)
    .single();

  if (posError || !position)
    throw new ApiError(404, "Position not found");

  let query = supabaseAdmin
    .from("position_items")
    .select("id, kind, body, display_order")
    .eq("position_id", id)
    .order("kind", { ascending: true })
    .order("display_order", { ascending: true });

  if (kind) query = query.eq("kind", kind);

  const { data, error } = await query;

  if (error)
    throw new ApiError(500, "Failed to fetch items: " + error.message);

  return res.status(200).json(
    new ApiResponse(200, data, "Position items fetched successfully")
  );
});

// ── POST /api/v1/admin/positions/:id/items ───────────────────
export const createPositionItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { kind, body, display_order } = req.validated;

  // Check position exists
  const { data: position, error: posError } = await supabaseAdmin
    .from("positions")
    .select("id")
    .eq("id", id)
    .single();

  if (posError || !position)
    throw new ApiError(404, "Position not found");

  // Validate kind
  if (!VALID_ITEM_KINDS.includes(kind)) {
    throw new ApiError(
      400,
      `Invalid kind. Must be one of: ${VALID_ITEM_KINDS.join(", ")}`
    );
  }

  // Auto-assign display_order if not provided
  // Get the current max display_order for this position + kind
  let finalDisplayOrder = display_order;
  if (finalDisplayOrder === undefined) {
    const { data: lastItem } = await supabaseAdmin
      .from("position_items")
      .select("display_order")
      .eq("position_id", id)
      .eq("kind", kind)
      .order("display_order", { ascending: false })
      .limit(1)
      .single();

    finalDisplayOrder = lastItem ? lastItem.display_order + 1 : 0;
  }

  const { data, error } = await supabaseAdmin
    .from("position_items")
    .insert({
      position_id:   id,
      kind,
      body,
      display_order: finalDisplayOrder,
    })
    .select("id, kind, body, display_order")
    .single();

  if (error) handleDbError(error);

  await logAudit(req.user, "CREATE", "position_items", data.id, {
    position_id: id,
    kind,
  });

  return res.status(201).json(
    new ApiResponse(201, data, "Position item created successfully")
  );
});

// ── PUT /api/v1/admin/positions/:id/items/:iid ───────────────
export const updatePositionItem = asyncHandler(async (req, res) => {
  const { id, iid } = req.params;
  const { kind, body, display_order } = req.validated;

  // Check item exists and belongs to this position
  const { data: existing, error: fetchError } = await supabaseAdmin
    .from("position_items")
    .select("id, position_id")
    .eq("id", iid)
    .eq("position_id", id)
    .single();

  if (fetchError || !existing)
    throw new ApiError(404, "Position item not found");

  // Validate kind if provided
  if (kind && !VALID_ITEM_KINDS.includes(kind)) {
    throw new ApiError(
      400,
      `Invalid kind. Must be one of: ${VALID_ITEM_KINDS.join(", ")}`
    );
  }

  const updates = {};
  if (kind          !== undefined) updates.kind          = kind;
  if (body          !== undefined) updates.body          = body;
  if (display_order !== undefined) updates.display_order = display_order;

  const { data, error } = await supabaseAdmin
    .from("position_items")
    .update(updates)
    .eq("id", iid)
    .eq("position_id", id)
    .select("id, kind, body, display_order")
    .single();

  if (error) handleDbError(error);

  await logAudit(req.user, "UPDATE", "position_items", iid, updates);

  return res.status(200).json(
    new ApiResponse(200, data, "Position item updated successfully")
  );
});

// ── DELETE /api/v1/admin/positions/:id/items/:iid ────────────
export const deletePositionItem = asyncHandler(async (req, res) => {
  const { id, iid } = req.params;

  // Check item exists and belongs to this position
  const { data: existing, error: fetchError } = await supabaseAdmin
    .from("position_items")
    .select("id, kind")
    .eq("id", iid)
    .eq("position_id", id)
    .single();

  if (fetchError || !existing)
    throw new ApiError(404, "Position item not found");

  const { error } = await supabaseAdmin
    .from("position_items")
    .delete()
    .eq("id", iid)
    .eq("position_id", id);

  if (error)
    throw new ApiError(500, "Failed to delete item: " + error.message);

  await logAudit(req.user, "DELETE", "position_items", iid, {
    position_id: id,
    kind: existing.kind,
  });

  return res.status(200).json(
    new ApiResponse(200, { id: iid }, "Position item deleted successfully")
  );
});

// ── PATCH /api/v1/admin/positions/:id/items/reorder ──────────
// Accepts array of { id, display_order } pairs
// Only reorders items within the same position
// Example body: { items: [{ id: "uuid1", display_order: 0 }, ...] }
export const reorderPositionItems = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { items } = req.validated;

  if (!Array.isArray(items) || items.length === 0)
    throw new ApiError(400, "items must be a non-empty array");

  // Check position exists
  const { data: position, error: posError } = await supabaseAdmin
    .from("positions")
    .select("id")
    .eq("id", id)
    .single();

  if (posError || !position)
    throw new ApiError(404, "Position not found");

  // Update each item's display_order in parallel
  const updates = items.map(({ id: itemId, display_order }) =>
    supabaseAdmin
      .from("position_items")
      .update({ display_order })
      .eq("id", itemId)
      .eq("position_id", id) // ensures item belongs to this position
  );

  const results = await Promise.all(updates);

  const failed = results.find((r) => r.error);
  if (failed) {
    throw new ApiError(
      500,
      "Failed to reorder items: " + failed.error.message
    );
  }

  await logAudit(req.user, "UPDATE", "position_items", "reorder", {
    position_id: id,
    count: items.length,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      { updated: items.length },
      "Position items reordered successfully"
    )
  );
});
