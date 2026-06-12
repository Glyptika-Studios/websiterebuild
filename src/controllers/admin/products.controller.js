import { supabaseAdmin } from "../../config/supabase.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { parsePagination } from "../../utils/pagination.js";
import { recordAuditLog } from "../../utils/auditLog.js";
import { toIlikePattern } from "../../utils/queryFilters.js";

const PRODUCT_SELECT =
  "id, title, category_id, active, publish, display_order, category:categories(id, label, slug)";
const VALID_PRICING_TIERS = ["basic", "standard", "premium"];
const MODULE_MANAGED_FIELDS = ["id", "product_id", "created_at", "updated_at"];
const PRICING_MANAGED_FIELDS = ["id", "module_id", "tier", "created_at", "updated_at"];
const PRODUCT_MEDIA_MANAGED_FIELDS = ["id", "product_id", "created_at", "updated_at"];

function omitFields(data, fields) {
  const copy = { ...data };
  for (const field of fields) delete copy[field];
  return copy;
}

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

function handleModuleWriteError(error) {
  if (error.code === "23505") {
    throw new ApiError(409, "A module with this unique value already exists");
  }

  if (error.code === "23503") {
    throw new ApiError(400, "Invalid module reference");
  }

  throw new ApiError(500, error.message);
}

async function getProductModuleOrThrow(productId, moduleId) {
  const { data, error } = await supabaseAdmin
    .from("product_modules")
    .select("*")
    .eq("id", moduleId)
    .eq("product_id", productId)
    .single();

  if (error) {
    if (error.code === "PGRST116") throw new ApiError(404, "Product module not found");
    throw new ApiError(500, error.message);
  }

  return data;
}

async function getModuleOrThrow(moduleId) {
  const { data, error } = await supabaseAdmin
    .from("product_modules")
    .select("*")
    .eq("id", moduleId)
    .single();

  if (error) {
    if (error.code === "PGRST116") throw new ApiError(404, "Product module not found");
    throw new ApiError(500, error.message);
  }

  return data;
}

async function getModulePricingOrThrow(moduleId, tier) {
  const { data, error } = await supabaseAdmin
    .from("module_pricing")
    .select("*")
    .eq("module_id", moduleId)
    .eq("tier", tier)
    .single();

  if (error) {
    if (error.code === "PGRST116") throw new ApiError(404, "Module pricing not found");
    throw new ApiError(500, error.message);
  }

  return data;
}

function handleProductMediaWriteError(error) {
  if (error.code === "23505") {
    throw new ApiError(409, "This media item is already attached to the product");
  }

  if (error.code === "23503") {
    throw new ApiError(400, "Invalid product media reference");
  }

  throw new ApiError(500, error.message);
}

async function getProductMediaOrThrow(productId, mediaEntryId) {
  const { data, error } = await supabaseAdmin
    .from("product_media")
    .select("*")
    .eq("id", mediaEntryId)
    .eq("product_id", productId)
    .single();

  if (error) {
    if (error.code === "PGRST116") throw new ApiError(404, "Product media item not found");
    throw new ApiError(500, error.message);
  }

  return data;
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

export const updateProductStatus = asyncHandler(async (req, res) => {
  await getProductByIdOrThrow(req.params.id);

  const { data, error } = await supabaseAdmin
    .from("products")
    .update(req.validated)
    .eq("id", req.params.id)
    .select(PRODUCT_SELECT)
    .single();

  if (error) handleProductWriteError(error);

  await recordAuditLog({
    user: req.user,
    action: "UPDATE_STATUS",
    entity: "products",
    entityId: data.id,
    metadata: req.validated,
  });

  return res.status(200).json(new ApiResponse(200, data, "Product status updated successfully"));
});

export const getProductModules = asyncHandler(async (req, res) => {
  await getProductByIdOrThrow(req.params.id);

  const { data, error } = await supabaseAdmin
    .from("product_modules")
    .select("*")
    .eq("product_id", req.params.id)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw new ApiError(500, error.message);

  return res.status(200).json(new ApiResponse(200, data, "Product modules retrieved successfully"));
});

export const createProductModule = asyncHandler(async (req, res) => {
  await getProductByIdOrThrow(req.params.id);
  const moduleData = omitFields(req.validated, MODULE_MANAGED_FIELDS);

  const { data, error } = await supabaseAdmin
    .from("product_modules")
    .insert({ ...moduleData, product_id: req.params.id })
    .select("*")
    .single();

  if (error) handleModuleWriteError(error);

  await recordAuditLog({
    user: req.user,
    action: "CREATE",
    entity: "product_modules",
    entityId: data.id,
    metadata: { product_id: req.params.id, title: data.title },
  });

  return res.status(201).json(new ApiResponse(201, data, "Product module created successfully"));
});

export const updateProductModule = asyncHandler(async (req, res) => {
  await getProductModuleOrThrow(req.params.id, req.params.mid);
  const moduleData = omitFields(req.validated, MODULE_MANAGED_FIELDS);

  if (Object.keys(moduleData).length === 0) {
    throw new ApiError(400, "Provide at least one editable module field");
  }

  const { data, error } = await supabaseAdmin
    .from("product_modules")
    .update(moduleData)
    .eq("id", req.params.mid)
    .eq("product_id", req.params.id)
    .select("*")
    .single();

  if (error) handleModuleWriteError(error);

  await recordAuditLog({
    user: req.user,
    action: "UPDATE",
    entity: "product_modules",
    entityId: data.id,
    metadata: { product_id: req.params.id, changes: moduleData },
  });

  return res.status(200).json(new ApiResponse(200, data, "Product module updated successfully"));
});

export const deleteProductModule = asyncHandler(async (req, res) => {
  const module = await getProductModuleOrThrow(req.params.id, req.params.mid);

  const { error } = await supabaseAdmin
    .from("product_modules")
    .delete()
    .eq("id", module.id)
    .eq("product_id", req.params.id);

  if (error) handleModuleWriteError(error);

  await recordAuditLog({
    user: req.user,
    action: "DELETE",
    entity: "product_modules",
    entityId: module.id,
    metadata: { product_id: req.params.id, title: module.title },
  });

  return res.status(200).json(new ApiResponse(200, { id: module.id }, "Product module deleted successfully"));
});

export const reorderProductModules = asyncHandler(async (req, res) => {
  await getProductByIdOrThrow(req.params.id);

  const moduleIds = req.validated.items.map((item) => item.id);
  const { data: existing, error: fetchError } = await supabaseAdmin
    .from("product_modules")
    .select("id")
    .eq("product_id", req.params.id)
    .in("id", moduleIds);

  if (fetchError) throw new ApiError(500, fetchError.message);
  if ((existing || []).length !== moduleIds.length) {
    throw new ApiError(400, "All module IDs must belong to this product");
  }

  const updates = await Promise.all(
    req.validated.items.map((item) =>
      supabaseAdmin
        .from("product_modules")
        .update({ display_order: item.display_order })
        .eq("id", item.id)
        .eq("product_id", req.params.id)
        .select("*")
        .single()
    )
  );

  const failed = updates.find((result) => result.error);
  if (failed) handleModuleWriteError(failed.error);

  const items = updates.map((result) => result.data).sort((a, b) => a.display_order - b.display_order);

  await recordAuditLog({
    user: req.user,
    action: "REORDER",
    entity: "product_modules",
    entityId: req.params.id,
    metadata: { product_id: req.params.id, items: req.validated.items },
  });

  return res.status(200).json(new ApiResponse(200, items, "Product modules reordered successfully"));
});

export const upsertModulePricing = asyncHandler(async (req, res) => {
  const { mid, tier } = req.params;

  if (!VALID_PRICING_TIERS.includes(tier)) {
    throw new ApiError(400, "Invalid pricing tier. Must be one of: basic, standard, premium");
  }

  const module = await getModuleOrThrow(mid);
  const pricingData = omitFields(req.validated, PRICING_MANAGED_FIELDS);

  if (Object.keys(pricingData).length === 0) {
    throw new ApiError(400, "Provide at least one editable pricing field");
  }

  const { data, error } = await supabaseAdmin
    .from("module_pricing")
    .upsert(
      {
        ...pricingData,
        module_id: mid,
        tier,
      },
      { onConflict: "module_id,tier" }
    )
    .select("*")
    .single();

  if (error) handleModuleWriteError(error);

  await recordAuditLog({
    user: req.user,
    action: "UPSERT",
    entity: "module_pricing",
    entityId: data.id || `${mid}:${tier}`,
    metadata: { module_id: mid, product_id: module.product_id, tier },
  });

  return res.status(200).json(new ApiResponse(200, data, "Module pricing saved successfully"));
});

export const deleteModulePricing = asyncHandler(async (req, res) => {
  const { mid, tier } = req.params;

  if (!VALID_PRICING_TIERS.includes(tier)) {
    throw new ApiError(400, "Invalid pricing tier. Must be one of: basic, standard, premium");
  }

  const module = await getModuleOrThrow(mid);
  const pricing = await getModulePricingOrThrow(mid, tier);

  const { error } = await supabaseAdmin
    .from("module_pricing")
    .delete()
    .eq("module_id", mid)
    .eq("tier", tier);

  if (error) handleModuleWriteError(error);

  await recordAuditLog({
    user: req.user,
    action: "DELETE",
    entity: "module_pricing",
    entityId: pricing.id || `${mid}:${tier}`,
    metadata: { module_id: mid, product_id: module.product_id, tier },
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      { id: pricing.id || null, module_id: mid, tier },
      "Module pricing deleted successfully"
    )
  );
});

export const addProductMedia = asyncHandler(async (req, res) => {
  await getProductByIdOrThrow(req.params.id);
  const mediaData = omitFields(req.validated, PRODUCT_MEDIA_MANAGED_FIELDS);

  const { data, error } = await supabaseAdmin
    .from("product_media")
    .insert({ ...mediaData, product_id: req.params.id })
    .select("*")
    .single();

  if (error) handleProductMediaWriteError(error);

  await recordAuditLog({
    user: req.user,
    action: "CREATE",
    entity: "product_media",
    entityId: data.id,
    metadata: { product_id: req.params.id, media_file_id: mediaData.media_file_id },
  });

  return res.status(201).json(new ApiResponse(201, data, "Product media added successfully"));
});

export const deleteProductMedia = asyncHandler(async (req, res) => {
  const mediaEntry = await getProductMediaOrThrow(req.params.id, req.params.emid);

  const { error } = await supabaseAdmin
    .from("product_media")
    .delete()
    .eq("id", mediaEntry.id)
    .eq("product_id", req.params.id);

  if (error) handleProductMediaWriteError(error);

  await recordAuditLog({
    user: req.user,
    action: "DELETE",
    entity: "product_media",
    entityId: mediaEntry.id,
    metadata: { product_id: req.params.id, media_file_id: mediaEntry.media_file_id },
  });

  return res.status(200).json(new ApiResponse(200, { id: mediaEntry.id }, "Product media removed successfully"));
});

export const reorderProductMedia = asyncHandler(async (req, res) => {
  await getProductByIdOrThrow(req.params.id);

  const mediaEntryIds = req.validated.items.map((item) => item.id);
  const { data: existing, error: fetchError } = await supabaseAdmin
    .from("product_media")
    .select("id")
    .eq("product_id", req.params.id)
    .in("id", mediaEntryIds);

  if (fetchError) throw new ApiError(500, fetchError.message);
  if ((existing || []).length !== mediaEntryIds.length) {
    throw new ApiError(400, "All media IDs must belong to this product");
  }

  const updates = await Promise.all(
    req.validated.items.map((item) =>
      supabaseAdmin
        .from("product_media")
        .update({ display_order: item.display_order })
        .eq("id", item.id)
        .eq("product_id", req.params.id)
        .select("*")
        .single()
    )
  );

  const failed = updates.find((result) => result.error);
  if (failed) handleProductMediaWriteError(failed.error);

  const items = updates.map((result) => result.data).sort((a, b) => a.display_order - b.display_order);

  await recordAuditLog({
    user: req.user,
    action: "REORDER",
    entity: "product_media",
    entityId: req.params.id,
    metadata: { product_id: req.params.id, items: req.validated.items },
  });

  return res.status(200).json(new ApiResponse(200, items, "Product gallery reordered successfully"));
});
