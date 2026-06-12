import { supabasePublic } from "../../config/supabase.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { toIlikePattern } from "../../utils/queryFilters.js";

export const getProjects = asyncHandler(async (req, res) => {
  const { category_id, published, search } = req.query;

  let query = supabasePublic
    .from("projects")
    .select(
      "id, title, category_id, active, publish, display_order, category:categories(id, label, slug)"
    )
    .eq("active", true)
    .order("display_order", { ascending: true })
    .order("title", { ascending: true });

  if (published === "true") query = query.eq("publish", true);
  if (category_id) query = query.eq("category_id", category_id);
  const searchPattern = toIlikePattern(search);
  if (searchPattern) query = query.ilike("title", searchPattern);

  const { data, error } = await query;
  if (error) throw new ApiError(500, error.message);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Projects retrieved successfully"));
});

export const getProjectById = asyncHandler(async (req, res) => {
  const { data, error } = await supabasePublic
    .from("projects")
    .select(
      "id, title, category_id, active, publish, display_order, category:categories(id, label, slug)"
    )
    .eq("id", req.params.id)
    .eq("active", true)
    .single();

  if (error) {
    if (error.code === "PGRST116") throw new ApiError(404, "Project not found");
    throw new ApiError(500, error.message);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Project retrieved successfully"));
});