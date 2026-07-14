export function parsePagination(query, { defaultLimit = 20, maxLimit = 100 } = {}) {
  const parsedPage = parseInt(query.page, 10);
  const parsedLimit = parseInt(query.limit, 10);

  const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const limit =
    Number.isInteger(parsedLimit) && parsedLimit > 0
      ? Math.min(maxLimit, parsedLimit)
      : defaultLimit;

  return {
    page,
    limit,
    from: (page - 1) * limit,
    to: page * limit - 1,
  };
}
