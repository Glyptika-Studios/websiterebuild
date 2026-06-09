import { ApiError } from "./ApiError.js";

export const POST_WITH_TAGS_SELECT =
  "*, category:categories(id, label, slug), post_tags(tag:tags(id, label, slug))";

export function slugifyTag(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function tagInputToArray(input = []) {
  if (Array.isArray(input)) return input;
  return String(input).split(",");
}

function prepareTags(input = []) {
  const tagsBySlug = new Map();

  for (const value of tagInputToArray(input)) {
    const label = String(value).trim();
    const slug = slugifyTag(label);

    if (!label || !slug || tagsBySlug.has(slug)) continue;

    tagsBySlug.set(slug, { label, slug });
  }

  return [...tagsBySlug.values()];
}

async function getTagIdsBySlug(supabase, slugs) {
  const { data, error } = await supabase
    .from("tags")
    .select("id, slug")
    .in("slug", slugs);

  if (error) throw new ApiError(500, error.message);
  return data || [];
}

function postIdsWithEveryRequestedTag(links = [], requiredTagCount) {
  const tagsByPostId = new Map();

  for (const { post_id, tag_id } of links) {
    const tagIds = tagsByPostId.get(post_id) || new Set();
    tagIds.add(tag_id);
    tagsByPostId.set(post_id, tagIds);
  }

  return [...tagsByPostId.entries()]
    .filter(([, tagIds]) => tagIds.size === requiredTagCount)
    .map(([postId]) => postId);
}

export function formatPostWithTags(post) {
  if (!post) return post;

  const tagRows = Array.isArray(post.post_tags) ? post.post_tags : [];
  const tags = tagRows.map((row) => row.tag?.label).filter(Boolean);

  const { post_tags, ...rest } = post;
  return { ...rest, tags };
}

export function formatPostsWithTags(posts = []) {
  return posts.map(formatPostWithTags);
}

export async function syncPostTags(supabase, postId, tags = []) {
  const preparedTags = prepareTags(tags);

  const { error: deleteError } = await supabase
    .from("post_tags")
    .delete()
    .eq("post_id", postId);

  if (deleteError) throw new ApiError(500, deleteError.message);

  if (!preparedTags.length) return;

  const { data: tagRows, error: tagError } = await supabase
    .from("tags")
    .upsert(preparedTags, { onConflict: "slug" })
    .select("id, slug");

  if (tagError) throw new ApiError(500, tagError.message);

  const rows = tagRows.map((tag) => ({ post_id: postId, tag_id: tag.id }));
  const { error: linkError } = await supabase.from("post_tags").insert(rows);

  if (linkError) throw new ApiError(500, linkError.message);
}

export async function getPostIdsForTags(supabase, tagsParam) {
  const requestedTags = prepareTags(tagsParam);
  if (!requestedTags.length) return null;

  const requestedSlugs = requestedTags.map((tag) => tag.slug);
  const tagRows = await getTagIdsBySlug(supabase, requestedSlugs);

  if (tagRows.length !== requestedSlugs.length) return [];

  const tagIds = tagRows.map((tag) => tag.id);
  const { data: links, error: linkError } = await supabase
    .from("post_tags")
    .select("post_id, tag_id")
    .in("tag_id", tagIds);

  if (linkError) throw new ApiError(500, linkError.message);

  return postIdsWithEveryRequestedTag(links, tagIds.length);
}
