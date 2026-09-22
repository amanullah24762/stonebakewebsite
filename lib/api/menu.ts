import { ApiError, createPublicApiClient, type ApiErrorCode, type ApiPagination } from "./client";

/** Customer-facing projections of the backend menu responses. */
export type MenuStatus = "AVAILABLE" | "OUT_OF_STOCK" | "INACTIVE";

export interface MenuCategory {
  id: string;
  name: string;
}

export interface PublicMenuItem {
  id: string;
  name: string;
  description: string | null;
  category: MenuCategory | null;
  /** Decimal strings preserve the precision returned by PostgreSQL. */
  price: string;
  discount_price: string | null;
  image: string | null;
  ingredients: string | null;
  status: MenuStatus;
}

export type MenuPagination = ApiPagination;

export interface MenuListResponse {
  items: PublicMenuItem[];
  pagination: MenuPagination;
}

export type MenuApiErrorCode = ApiErrorCode;

export class MenuApiError extends ApiError {
  constructor(message: string, code: MenuApiErrorCode, status: number | null = null) {
    super(message, code, status);
    this.name = "MenuApiError";
  }
}

const { apiBaseUrl, invalidResponse, record, string, nullableString, imageUrl, pagination, request } =
  createPublicApiClient("menu", MenuApiError);

function decimal(value: unknown): string {
  if (typeof value !== "string" && typeof value !== "number") return invalidResponse();
  const result = String(value);
  if (!/^\d+(\.\d+)?$/.test(result) || !Number.isFinite(Number(result))) return invalidResponse();
  return result;
}

function menuItem(value: unknown, baseUrl: string): PublicMenuItem {
  const item = record(value);
  const status = item.status;
  if (status !== "AVAILABLE" && status !== "OUT_OF_STOCK" && status !== "INACTIVE") return invalidResponse();
  const category = item.category === null ? null : record(item.category);
  // Explicit projection keeps internal fields out of the client result.
  return {
    id: string(item.id),
    name: string(item.name),
    description: nullableString(item.description),
    category: category ? { id: string(category.id), name: string(category.name) } : null,
    price: decimal(item.price),
    discount_price: item.discount_price === null ? null : decimal(item.discount_price),
    image: imageUrl(item.image, baseUrl),
    ingredients: nullableString(item.ingredients),
    status,
  };
}

export interface MenuQuery {
  categoryId?: string;
}

/** Returns the first page, optionally filtered by a backend category UUID. */
export async function getMenuItems(query: MenuQuery = {}): Promise<MenuListResponse> {
  const baseUrl = apiBaseUrl();
  const params = new URLSearchParams();
  if (query.categoryId !== undefined) {
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(query.categoryId)) {
      throw new MenuApiError("Please provide a valid category ID.", "INVALID_ARGUMENT");
    }
    params.set("category_id", query.categoryId);
  }
  const search = params.toString();
  const data = await request(
  search
    ? `/public/menu?${search}`
    : "/public/menu",
  baseUrl
);
  if (!Array.isArray(data.items)) return invalidResponse();
  return {
    items: data.items.map((item: unknown) => menuItem(item, baseUrl)),
    pagination: pagination(data.pagination),
  };
}

export async function getMenuItem(id: string): Promise<PublicMenuItem> {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    throw new MenuApiError("Please provide a valid menu item ID.", "INVALID_ARGUMENT");
  }
  const baseUrl = apiBaseUrl();
  const data = await request(
  `/public/menu/${encodeURIComponent(id)}`,
  baseUrl
);
  return menuItem(data.item, baseUrl);
}
