import { supabasePublic } from "../../config/supabase.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";

export const getProducts = asyncHandler(async (req, res) => {
  const { category_id, published, search } = req.query;

  let query = supabasePublic
    .from("products")
    .select(
      "id, title, category_id, active, publish, display_order, category:categories(id, label, slug)"
    )
    .eq("active", true)
    .order("display_order", { ascending: true })
    .order("title", { ascending: true });

  if (published === "true") query = query.eq("publish", true);
  if (category_id) query = query.eq("category_id", category_id);
  if (search) query = query.ilike("title", `%${search}%`);

  const { data, error } = await query;
  if (error) throw new ApiError(500, error.message);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Products retrieved successfully"));
});
