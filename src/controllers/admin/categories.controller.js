import { supabaseAdmin } from "../../config/supabase.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";

const VALID_SCOPES = ["post", "product", "service", "project"];

async function getCategoryByIdOrThrow(id) {
  const { data, error } = await supabaseAdmin
    .from("categories")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") throw new ApiError(404, "Category not found");
    throw new ApiError(500, error.message);
  }

  return data;
}

async function writeAuditLog(action, entityId, metadata) {
  const { error } = await supabaseAdmin
    .from("audit_logs")
    .insert({
      action,
      entity: "categories",
      entity_id: entityId,
      metadata,
    });

  if (error) throw new ApiError(500, "Database error: " + error.message);
}

function handleCategoryWriteError(error) {
  if (error.code === "23505") {
    throw new ApiError(409, "A category with this slug already exists for this scope");
  }

  if (error.message?.includes("invalid input value for enum")) {
    throw new ApiError(400, "Invalid scope value");
  }

  throw new ApiError(500, error.message);
}

export const getCategories = asyncHandler(async (req, res) => {
  const parsedLimit = parseInt(req.query.limit);
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parsedLimit > 0 ? parsedLimit : 20));
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  const { scope, active, search } = req.query;

  if (scope && !VALID_SCOPES.includes(scope)) {
    throw new ApiError(400, "Invalid scope. Must be one of: post, product, service, project");
  }

  let query = supabaseAdmin
    .from("categories")
    .select("id, label, scope, slug, display_order, active, created_at", { count: "exact" });

  if (scope) query = query.eq("scope", scope);
  if (active === "true" || active === "false") query = query.eq("active", active === "true");
  if (search) query = query.ilike("label", `%${search}%`);

  query = query
    .order("scope", { ascending: true })
    .order("display_order", { ascending: true })
    .order("label", { ascending: true })
    .range(from, to);

  const { data, error, count } = await query;
  if (error) throw new ApiError(500, error.message);

  return res.status(200).json(
    new ApiResponse(
      200,
      { items: data, meta: { page, limit, total: count } },
      "Categories retrieved successfully"
    )
  );
});

export const getCategoryById = asyncHandler(async (req, res) => {
  const category = await getCategoryByIdOrThrow(req.params.id);
  return res.status(200).json(new ApiResponse(200, category, "Category retrieved successfully"));
});

export const createCategory = asyncHandler(async (req, res) => {
  // Category scope is enforced again by database triggers on content tables.
  // Assigning a post category to a product, for example, raises a scope mismatch there.
  const { data, error } = await supabaseAdmin
    .from("categories")
    .insert(req.validated)
    .select("*")
    .single();

  if (error) handleCategoryWriteError(error);

  await writeAuditLog("CREATE", data.id, { label: data.label, scope: data.scope });

  return res.status(201).json(new ApiResponse(201, data, "Category created successfully"));
});

export const updateCategory = asyncHandler(async (req, res) => {
  await getCategoryByIdOrThrow(req.params.id);

  // Changing scope can affect which content tables may safely reference this category.
  // Related posts, products, and projects are protected by fn_check_category_scope triggers.
  const { data, error } = await supabaseAdmin
    .from("categories")
    .update(req.validated)
    .eq("id", req.params.id)
    .select("*")
    .single();

  if (error) handleCategoryWriteError(error);

  await writeAuditLog("UPDATE", req.params.id, req.validated);

  return res.status(200).json(new ApiResponse(200, data, "Category updated successfully"));
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await getCategoryByIdOrThrow(req.params.id);

  const { error } = await supabaseAdmin
    .from("categories")
    .delete()
    .eq("id", category.id);

  if (error) {
    if (error.code === "23503") {
      throw new ApiError(
        409,
        "Cannot delete this category — it is assigned to existing content. Remove it from all posts, products, projects, and services first."
      );
    }

    throw new ApiError(500, error.message);
  }

  await writeAuditLog("DELETE", category.id, { label: category.label, scope: category.scope });

  return res.status(200).json(new ApiResponse(200, { id: category.id }, "Category deleted successfully"));
});
