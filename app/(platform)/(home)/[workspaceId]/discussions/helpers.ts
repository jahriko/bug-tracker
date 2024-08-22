export function parseSearchParams(
  searchParams: Record<string, string | string[] | undefined>,
) {
  const page = Number(searchParams.page) || 1;
  const pageSize = Number(searchParams.pageSize) || 10;
  const category = searchParams.category as string | undefined;
  const search = searchParams.search as string | undefined;

  return { page, pageSize, category, search };
}

export function getPaginationData(
  currentPage: number,
  totalItems: number,
  pageSize: number,
) {
  const totalPages = Math.ceil(totalItems / pageSize);
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  return {
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    pageSize,
    totalItems,
  };
}