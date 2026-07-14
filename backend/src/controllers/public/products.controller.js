import { supabasePublic } from "../../config/supabase.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { toIlikePattern } from "../../utils/queryFilters.js";
import { formatProductWithTags, formatProductsWithTags } from "../../utils/productTags.js";

export const getProducts = asyncHandler(async (req, res) => {
  const { category_id, search } = req.query;

  let query = supabasePublic
    .from("products")
    .select(
      "id, title, overview, description, category_id, cover_id, featured, status, published_at, category:categories(id, label, slug), cover:media_files(id, public_url), entity_media(id, display_order, media:media_files(id, public_url)), product_tags(tag:tags(id, label, slug))"
    )
    .eq("status", "published")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (category_id) query = query.eq("category_id", category_id);
  const searchPattern = toIlikePattern(search);
  if (searchPattern) query = query.ilike("title", searchPattern);

  const { data, error } = await query;
  if (error) throw new ApiError(500, error.message);

  return res
    .status(200)
    .json(new ApiResponse(200, formatProductsWithTags(data), "Products retrieved successfully"));
});

export const getProductById = asyncHandler(async (req, res) => {
  const { data, error } = await supabasePublic
    .from("products")
    .select(
      "id, title, overview, description, category_id, cover_id, featured, status, published_at, category:categories(id, label, slug), cover:media_files(id, public_url), entity_media(id, display_order, media:media_files(id, public_url)), product_tags(tag:tags(id, label, slug)), product_modules(id, title, description, display_order, active, module_pricing(module_id, tier, price_amount, currency, billing_cycle, details))"
    )
    .eq("id", req.params.id)
    .eq("status", "published")
    .single();

  if (error) {
    if (error.code === "PGRST116") throw new ApiError(404, "Product not found");
    throw new ApiError(500, error.message);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, formatProductWithTags(data), "Product retrieved successfully"));
});