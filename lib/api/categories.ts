
import {
  ApiError,
  createPublicApiClient,
  type ApiErrorCode,
  type ApiPagination,
} from "./client";

import type { MenuCategory } from "./menu";

export type CategoryStatus = "ACTIVE" | "INACTIVE";

export interface PublicCategory extends MenuCategory {
  description: string | null;
  image: string | null;
  status: CategoryStatus;
}

export interface CategoryListResponse {
  items: PublicCategory[];
  pagination: ApiPagination;
}

export class CategoryApiError extends ApiError {
  constructor(
    message: string,
    code: ApiErrorCode,
    status: number | null = null
  ) {
    super(message, code, status);
    this.name = "CategoryApiError";
  }
}

const {
  apiBaseUrl,
  invalidResponse,
  record,
  string,
  nullableString,
  imageUrl,
  pagination,
  request,
} = createPublicApiClient(
  "categories",
  CategoryApiError
);

// Convert backend category to website format

function category(
  value: unknown,
  baseUrl: string
): PublicCategory {
  const item = record(value);

  if (
    item.status !== "ACTIVE" &&
    item.status !== "INACTIVE"
  ) {
    return invalidResponse();
  }

  return {
    id: string(item.id),

    name: string(item.name),

    description: nullableString(
      item.description ?? null
    ),

    image: imageUrl(
      item.image ?? null,
      baseUrl
    ),

    status: item.status,
  };
}

// Fetch categories from public backend API

export async function getCategories(): Promise<CategoryListResponse> {
  const baseUrl = apiBaseUrl();

  const data = await request(
    "/public/categories",
    baseUrl
  );

  if (!Array.isArray(data.items)) {
    return invalidResponse();
  }

  const items = data.items.map(
    (item: unknown) => category(item, baseUrl)
  );

  // Public API currently returns all categories
  // without pagination metadata.

  const paginationData: ApiPagination =
    data.pagination === undefined
      ? {
          currentPage: 1,
          pageSize: Math.max(1, items.length),
          totalItems: items.length,
          totalPages: items.length > 0 ? 1 : 0,
          hasNextPage: false,
          hasPreviousPage: false,
        }
      : pagination(data.pagination);

  return {
    items,
    pagination: paginationData,
  };
}