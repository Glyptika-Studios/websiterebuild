export function normalizeSearchTerm(value, { maxLength = 100 } = {}) {
  const rawValue = Array.isArray(value) ? value[0] : value;

  if (typeof rawValue !== "string") return "";

  return rawValue
    .trim()
    .slice(0, maxLength)
    .replace(/[%_*(),{}[\]"'\\]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function toIlikePattern(value, options) {
  const searchTerm = normalizeSearchTerm(value, options);
  return searchTerm ? `%${searchTerm}%` : null;
}

export function buildIlikeOrFilter(columns, value, options) {
  const pattern = toIlikePattern(value, options);
  if (!pattern) return null;

  return columns.map((column) => `${column}.ilike.${pattern}`).join(",");
}
