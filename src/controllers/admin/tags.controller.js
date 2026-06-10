import { supabaseAdmin } from "../../config/supabase.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";

async function getTagByIdOrThrow(id) {
  const { data, error } = await supabaseAdmin
    .from("tags")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") throw new ApiError(404, "Tag not found");
    throw new ApiError(500, error.message);
  }

  return data;
}

export const getTags = asyncHandler(async (req, res) => {
  const parsedLimit = parseInt(req.query.limit);
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parsedLimit > 0 ? parsedLimit : 20));
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  const { search } = req.query;

  let query = supabaseAdmin
    .from("tags")
    .select("id, slug, label, created_at", { count: "exact" });

  if (search) {
    query = query.or(`label.ilike.%${search}%,slug.ilike.%${search}%`);
  }

  query = query.order("label", { ascending: true }).range(from, to);

  const { data, error, count } = await query;
  if (error) throw new ApiError(500, error.message);

  return res.status(200).json(
    new ApiResponse(
      200,
      { items: data, meta: { page, limit, total: count } },
      "Tags retrieved successfully"
    )
  );
});

export const getTagById = asyncHandler(async (req, res) => {
  const tag = await getTagByIdOrThrow(req.params.id);
  return res.status(200).json(new ApiResponse(200, tag, "Tag retrieved successfully"));
});

export const createTag = asyncHandler(async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from("tags")
    .insert(req.validated)
    .select("*")
    .single();

  if (error) {
    if (error.code === "23505") throw new ApiError(409, "A tag with this slug already exists");
    throw new ApiError(500, error.message);
  }

  return res.status(201).json(new ApiResponse(201, data, "Tag created successfully"));
});

export const updateTag = asyncHandler(async (req, res) => {
  await getTagByIdOrThrow(req.params.id);

  const { data, error } = await supabaseAdmin
    .from("tags")
    .update(req.validated)
    .eq("id", req.params.id)
    .select("*")
    .single();

  if (error) {
    if (error.code === "23505") throw new ApiError(409, "A tag with this slug already exists");
    throw new ApiError(500, error.message);
  }

  return res.status(200).json(new ApiResponse(200, data, "Tag updated successfully"));
});

export const deleteTag = asyncHandler(async (req, res) => {
  const tag = await getTagByIdOrThrow(req.params.id);

  const { error } = await supabaseAdmin
    .from("tags")
    .delete()
    .eq("id", tag.id);

  if (error) {
    if (error.code === "23503") {
      throw new ApiError(
        409,
        "Cannot delete tag — it is assigned to existing content. Remove it from all posts, products, and projects first."
      );
    }

    throw new ApiError(500, error.message);
  }

  return res.status(200).json(new ApiResponse(200, { id: tag.id }, "Tag deleted successfully"));
});
