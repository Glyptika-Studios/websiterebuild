import { ApiError } from "./ApiError.js";
import { slugifyTag } from "./postTags.js";

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

export function formatProductWithTags(product) {
  if (!product) return product;

  const tagRows = Array.isArray(product.product_tags) ? product.product_tags : [];
  const tags = tagRows.map((row) => row.tag?.label).filter(Boolean);

  const { product_tags, ...rest } = product;
  return { ...rest, tags };
}

export function formatProductsWithTags(products = []) {
  return products.map(formatProductWithTags);
}

export async function syncProductTags(supabase, productId, tags = []) {
  const preparedTags = prepareTags(tags);

  const { error: deleteError } = await supabase
    .from("product_tags")
    .delete()
    .eq("product_id", productId);

  if (deleteError) throw new ApiError(500, deleteError.message);

  if (!preparedTags.length) return;

  const { data: tagRows, error: tagError } = await supabase
    .from("tags")
    .upsert(preparedTags, { onConflict: "slug" })
    .select("id, slug");

  if (tagError) throw new ApiError(500, tagError.message);

  const rows = tagRows.map((tag) => ({ product_id: productId, tag_id: tag.id }));
  const { error: linkError } = await supabase.from("product_tags").insert(rows);

  if (linkError) throw new ApiError(500, linkError.message);
}
