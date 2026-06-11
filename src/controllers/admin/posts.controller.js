import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { recordAuditLog } from "../../utils/auditLog.js";
import { parsePagination } from "../../utils/pagination.js";
import { buildIlikeOrFilter } from "../../utils/queryFilters.js";
import {
  formatPostWithTags,
  formatPostsWithTags,
  getPostIdsForTags,
  POST_WITH_TAGS_SELECT,
  syncPostTags,
} from "../../utils/postTags.js";

async function getPostByIdOrThrow(supabase, id) {
  const { data, error } = await supabase
    .from("posts")
    .select(POST_WITH_TAGS_SELECT)
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") throw new ApiError(404, "Post not found");
    throw new ApiError(500, error.message);
  }

  return data;
}

export const getAdminPosts = asyncHandler(async (req, res) => {
  const { type, category_id, featured, tags, search } = req.query;

  const { page, limit, from, to } = parsePagination(req.query);

  const matchingPostIds = tags ? await getPostIdsForTags(req.supabase, tags) : null;

  if (Array.isArray(matchingPostIds) && matchingPostIds.length === 0) {
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          posts: [],
          pagination: { page, limit, total: 0, totalPages: 0 },
        },
        "Admin posts retrieved successfully"
      )
    );
  }

  let query = req.supabase
    .from("posts")
    .select(POST_WITH_TAGS_SELECT, { count: "exact" });

  if (type) query = query.eq("type", type);
  if (category_id) query = query.eq("category_id", category_id);
  if (featured === "true") query = query.eq("featured", true);
  if (Array.isArray(matchingPostIds)) query = query.in("id", matchingPostIds);
  const searchFilter = buildIlikeOrFilter(["title", "excerpt"], search);
  if (searchFilter) query = query.or(searchFilter);

  query = query.order("created_at", { ascending: false }).range(from, to);

  const { data, error, count } = await query;
  if (error) throw new ApiError(500, error.message);

  const resultData = {
    posts: formatPostsWithTags(data),
    pagination: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit),
    },
  };

  return res.status(200).json(new ApiResponse(200, resultData, "Admin posts retrieved successfully"));
});

export const getAdminPostById = asyncHandler(async (req, res) => {
  const data = await getPostByIdOrThrow(req.supabase, req.params.id);
  return res.status(200).json(new ApiResponse(200, formatPostWithTags(data), "Post retrieved successfully"));
});

export const createAdminPost = asyncHandler(async (req, res) => {
  const { tags = [], ...postData } = req.validated;
  const { data, error } = await req.supabase
    .from("posts")
    .insert({ ...postData, author_id: req.user.id })
    .select("id")
    .single();

  if (error) throw new ApiError(500, error.message);

  try {
    await syncPostTags(req.supabase, data.id, tags);
  } catch (tagError) {
    await req.supabase.from("posts").delete().eq("id", data.id);
    throw tagError;
  }

  const post = await getPostByIdOrThrow(req.supabase, data.id);
  await recordAuditLog({
    user: req.user,
    action: "CREATE",
    entity: "posts",
    entityId: data.id,
    metadata: { title: post.title, type: post.type, tags },
  });

  return res.status(201).json(new ApiResponse(201, formatPostWithTags(post), "Post created successfully"));
});

export const updateAdminPost = asyncHandler(async (req, res) => {
  const { tags, ...postData } = req.validated;
  const hasPostData = Object.keys(postData).length > 0;

  if (hasPostData) {
    const { error } = await req.supabase
      .from("posts")
      .update(postData)
      .eq("id", req.params.id)
      .select("id")
      .single();

    if (error) {
      if (error.code === "PGRST116") throw new ApiError(404, "Post not found");
      throw new ApiError(500, error.message);
    }
  } else {
    await getPostByIdOrThrow(req.supabase, req.params.id);
  }

  if (tags !== undefined) {
    await syncPostTags(req.supabase, req.params.id, tags);
  }

  const post = await getPostByIdOrThrow(req.supabase, req.params.id);
  await recordAuditLog({
    user: req.user,
    action: "UPDATE",
    entity: "posts",
    entityId: req.params.id,
    metadata: { ...postData, ...(tags !== undefined ? { tags } : {}) },
  });

  return res.status(200).json(new ApiResponse(200, formatPostWithTags(post), "Post updated successfully"));
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

  await recordAuditLog({
    user: req.user,
    action: "DELETE",
    entity: "posts",
    entityId: data.id,
    metadata: { id: data.id },
  });

  return res.status(200).json(new ApiResponse(200, { id: data.id, deleted: true }, "Post deleted successfully"));
});
