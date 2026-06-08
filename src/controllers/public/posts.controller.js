import { supabasePublic } from "../../config/supabase.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";

export const getPosts = asyncHandler(async (req, res) => {
  const { type, category_id, featured, tags, search, page = 1, limit = 10 } = req.query;

  const pg = Math.max(1, Number(page));
  const lim = Math.min(50, Math.max(1, Number(limit)));
  const from = (pg - 1) * lim;
  const to = from + lim - 1;

  let query = supabasePublic
    .from("posts")
    .select("*, category:categories(id, label, slug)", { count: "exact" });

  if (type) query = query.eq("type", type);
  if (category_id) query = query.eq("category_id", category_id);
  if (featured === "true") query = query.eq("featured", true);
  if (tags) query = query.contains("tags", tags.split(","));
  if (search) {
    query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
  }

  query = query.order("published_at", { ascending: false }).range(from, to);

  const { data, error, count } = await query;
  if (error) throw new ApiError(500, error.message);

  const resultData = {
    posts: data,
    pagination: {
      page: pg,
      limit: lim,
      total: count,
      totalPages: Math.ceil(count / lim),
    },
  };

  return res.status(200).json(new ApiResponse(200, resultData, "Posts retrieved successfully"));
});

export const getPostBySlug = asyncHandler(async (req, res) => {
  const { data, error } = await supabasePublic
    .from("posts")
    .select("*, category:categories(id, label, slug)")
    .eq("slug", req.params.slug)
    .single();

  if (error) {
    if (error.code === "PGRST116") throw new ApiError(404, "Post not found");
    throw new ApiError(500, error.message);
  }

  return res.status(200).json(new ApiResponse(200, data, "Post retrieved successfully"));
});

export const getPostById = asyncHandler(async (req, res) => {
  const { data, error } = await supabasePublic
    .from("posts")
    .select("*, category:categories(id, label, slug)")
    .eq("id", req.params.id)
    .single();

  if (error) {
    if (error.code === "PGRST116") throw new ApiError(404, "Post not found");
    throw new ApiError(500, error.message);
  }

  return res.status(200).json(new ApiResponse(200, data, "Post retrieved successfully"));
});
