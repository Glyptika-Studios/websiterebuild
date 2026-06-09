import { supabasePublic } from "../../config/supabase.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import {
  formatPostWithTags,
  formatPostsWithTags,
  getPostIdsForTags,
  POST_WITH_TAGS_SELECT,
} from "../../utils/postTags.js";

export const getPosts = asyncHandler(async (req, res) => {
  const { type, category_id, featured, tags, search, page = 1, limit = 10 } = req.query;

  const pg = Math.max(1, Number(page));
  const lim = Math.min(50, Math.max(1, Number(limit)));
  const from = (pg - 1) * lim;
  const to = from + lim - 1;

  const matchingPostIds = tags ? await getPostIdsForTags(supabasePublic, tags) : null;

  if (Array.isArray(matchingPostIds) && matchingPostIds.length === 0) {
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          posts: [],
          pagination: { page: pg, limit: lim, total: 0, totalPages: 0 },
        },
        "Posts retrieved successfully"
      )
    );
  }

  let query = supabasePublic
    .from("posts")
    .select(POST_WITH_TAGS_SELECT, { count: "exact" });

  if (type) query = query.eq("type", type);
  if (category_id) query = query.eq("category_id", category_id);
  if (featured === "true") query = query.eq("featured", true);
  if (Array.isArray(matchingPostIds)) query = query.in("id", matchingPostIds);
  if (search) {
    query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
  }

  query = query.order("published_at", { ascending: false }).range(from, to);

  const { data, error, count } = await query;
  if (error) throw new ApiError(500, error.message);

  const resultData = {
    posts: formatPostsWithTags(data),
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
    .select(POST_WITH_TAGS_SELECT)
    .eq("slug", req.params.slug)
    .single();

  if (error) {
    if (error.code === "PGRST116") throw new ApiError(404, "Post not found");
    throw new ApiError(500, error.message);
  }

  return res.status(200).json(new ApiResponse(200, formatPostWithTags(data), "Post retrieved successfully"));
});

export const getPostById = asyncHandler(async (req, res) => {
  const { data, error } = await supabasePublic
    .from("posts")
    .select(POST_WITH_TAGS_SELECT)
    .eq("id", req.params.id)
    .single();

  if (error) {
    if (error.code === "PGRST116") throw new ApiError(404, "Post not found");
    throw new ApiError(500, error.message);
  }

  return res.status(200).json(new ApiResponse(200, formatPostWithTags(data), "Post retrieved successfully"));
});
