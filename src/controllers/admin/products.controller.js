import { supabaseAdmin } from "../../config/supabase.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { parsePagination } from "../../utils/pagination.js";
import { recordAuditLog } from "../../utils/auditLog.js";
import { toIlikePattern } from "../../utils/queryFilters.js";

const PRODUCT_SELECT =
  "id, title, category_id, active, publish, display_order, category:categories(id, label, slug)";

async function getProductByIdOrThrow(id) {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") throw new ApiError(404, "Product not found");
    throw new ApiError(500, error.message);
  }

  return data;
}

async function ensureProductCategory(categoryId) {
  if (!categoryId) return;

  const { data, error } = await supabaseAdmin
    .from("categories")
    .select("id, scope")
    .eq("id", categoryId)
    .single();

  if (error) {
    if (error.code === "PGRST116") throw new ApiError(404, "Product category not found");
    throw new ApiError(500, error.message);
  }

  if (data.scope !== "product") {
    throw new ApiError(400, "Product category must have scope 'product'");
  }
}

function handleProductWriteError(error) {
  if (error.code === "23505") {
    throw new ApiError(409, "A product with this unique value already exists");
  }

  if (error.code === "23503") {
    throw new ApiError(400, "Invalid product reference");
  }

  if (error.message?.toLowerCase().includes("category scope")) {
    throw new ApiError(400, "Product category must have scope 'product'");
  }

  throw new ApiError(500, error.message);
}

export const getProducts = asyncHandler(async (req, res) => {
  const { category_id, active, search } = req.query;
  const published = req.query.published ?? req.query.publish;
  const { page, limit, from, to } = parsePagination(req.query);

  let query = supabaseAdmin
    .from("products")
    .select(PRODUCT_SELECT, { count: "exact" });

  if (category_id) query = query.eq("category_id", category_id);
  if (active === "true" || active === "false") query = query.eq("active", active === "true");
  if (published === "true" || published === "false") {
    query = query.eq("publish", published === "true");
  }
  const searchPattern = toIlikePattern(search);
  if (searchPattern) query = query.ilike("title", searchPattern);

  query = query
    .order("display_order", { ascending: true })
    .order("title", { ascending: true })
    .range(from, to);

  const { data, error, count } = await query;
  if (error) throw new ApiError(500, error.message);

  return res.status(200).json(
    new ApiResponse(
      200,
      { items: data, meta: { page, limit, total: count } },
      "Products retrieved successfully"
    )
  );
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await getProductByIdOrThrow(req.params.id);
  return res.status(200).json(new ApiResponse(200, product, "Product retrieved successfully"));
});

export const createProduct = asyncHandler(async (req, res) => {
  await ensureProductCategory(req.validated.category_id);

  const { data, error } = await supabaseAdmin
    .from("products")
    .insert(req.validated)
    .select(PRODUCT_SELECT)
    .single();

  if (error) handleProductWriteError(error);

  await recordAuditLog({
    user: req.user,
    action: "CREATE",
    entity: "products",
    entityId: data.id,
    metadata: { title: data.title, category_id: data.category_id },
  });

  return res.status(201).json(new ApiResponse(201, data, "Product created successfully"));
});

export const updateProduct = asyncHandler(async (req, res) => {
  await getProductByIdOrThrow(req.params.id);

  if (Object.prototype.hasOwnProperty.call(req.validated, "category_id")) {
    await ensureProductCategory(req.validated.category_id);
  }

  const { data, error } = await supabaseAdmin
    .from("products")
    .update(req.validated)
    .eq("id", req.params.id)
    .select(PRODUCT_SELECT)
    .single();

  if (error) handleProductWriteError(error);

  await recordAuditLog({
    user: req.user,
    action: "UPDATE",
    entity: "products",
    entityId: data.id,
    metadata: req.validated,
  });

  return res.status(200).json(new ApiResponse(200, data, "Product updated successfully"));
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await getProductByIdOrThrow(req.params.id);

  const { error } = await supabaseAdmin
    .from("products")
    .delete()
    .eq("id", product.id);

  if (error) {
    if (error.code === "23503") {
      throw new ApiError(
        409,
        "Cannot delete this product because it is referenced by existing proposals or content."
      );
    }

    throw new ApiError(500, error.message);
  }

  await recordAuditLog({
    user: req.user,
    action: "DELETE",
    entity: "products",
    entityId: product.id,
    metadata: { title: product.title },
  });

  return res.status(200).json(new ApiResponse(200, { id: product.id }, "Product deleted successfully"));
});
