import { supabasePublic } from "../../config/supabase.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { toIlikePattern } from "../../utils/queryFilters.js";

export const getProjects = asyncHandler(async (req, res) => {
  const { category_id, search } = req.query;

  let query = supabasePublic
    .from("projects")
    .select(
      "id, title, description, category_id, featured, status, cover_id, published_at, category:categories(id, label, slug), cover:media_files(id, public_url), entity_media(id, display_order, media:media_files(id, public_url))"
    )
    .in("status", ["ongoing", "completed"])
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

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
      "id, title, description, category_id, featured, status, cover_id, published_at, category:categories(id, label, slug), cover:media_files(id, public_url), entity_media(id, display_order, media:media_files(id, public_url))"
    )
    .eq("id", req.params.id)
    .in("status", ["ongoing", "completed"])
    .single();

  if (error) {
    if (error.code === "PGRST116") throw new ApiError(404, "Project not found");
    throw new ApiError(500, error.message);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Project retrieved successfully"));
});