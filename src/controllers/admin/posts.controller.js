import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";

export const getAdminPosts = asyncHandler(async (req, res) => {
  const { type, category_id, featured, tags, search, page = 1, limit = 20 } = req.query;

  const pg = Math.max(1, Number(page));
  const lim = Math.min(100, Math.max(1, Number(limit)));
  const from = (pg - 1) * lim;
  const to = from + lim - 1;

  let query = req.supabase
    .from("posts")
    .select("*, category:categories(id, label, slug)", { count: "exact" });

  if (type) query = query.eq("type", type);
  if (category_id) query = query.eq("category_id", category_id);
  if (featured === "true") query = query.eq("featured", true);
  if (tags) query = query.contains("tags", tags.split(","));
  if (search) {
    query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
  }

  query = query.order("created_at", { ascending: false }).range(from, to);

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

  return res.status(200).json(new ApiResponse(200, resultData, "Admin posts retrieved successfully"));
});

export const getAdminPostById = asyncHandler(async (req, res) => {
  const { data, error } = await req.supabase
    .from("posts")
    .select("*, category:categories(id, label, slug)")
    .eq("id", req.params.id)
    .single();

  if (error) {
    if (error.code === "PGRST116") throw new ApiError(404, "Post not found");
    else throw new ApiError(500, error.message);
  }

  return res.status(200).json(new ApiResponse(200, data, "Post retrieved successfully"));
});

export const createAdminPost = asyncHandler(async (req, res) => {
  const { data, error } = await req.supabase
    .from("posts")
    .insert({ ...req.validated, author_id: req.user.id })
    .select("*, category:categories(id, label, slug)")
    .single();

  if (error) throw new ApiError(500, error.message);

  return res.status(201).json(new ApiResponse(201, data, "Post created successfully"));
});

export const updateAdminPost = asyncHandler(async (req, res) => {
  const { data, error } = await req.supabase
    .from("posts")
    .update(req.validated)
    .eq("id", req.params.id)
    .select("*, category:categories(id, label, slug)")
    .single();

  if (error) {
    if (error.code === "PGRST116") throw new ApiError(404, "Post not found");
    throw new ApiError(500, error.message);
  }

  return res.status(200).json(new ApiResponse(200, data, "Post updated successfully"));
});

export const deleteAdminPost = asyncHandler(async (req, res) => {
  const { data, error } = await req.supabase
    .from("posts")
    .delete()
    .eq("id", req.params.id)
    .select("id")
    .single();

  if (error) {
    if (error.code === "PGRST116") throw new ApiError(404, "Post not found");
    throw new ApiError(500, error.message);
  }

  return res.status(200).json(new ApiResponse(200, { id: data.id, deleted: true }, "Post deleted successfully"));
});
