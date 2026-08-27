export interface PaginationQuery {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function parsePagination(query: { page?: string; limit?: string }): PaginationQuery {
  const page = Math.max(1, parseInt(query.page || '1', 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit || '10', 10) || 10));
  return { page, limit };
}

export function paginate<T>(items: T[], { page, limit }: PaginationQuery): PaginatedResult<T> {
  const total = items.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const start = (page - 1) * limit;
  const data = items.slice(start, start + limit);

  return { data, meta: { page, limit, total, totalPages } };
}
