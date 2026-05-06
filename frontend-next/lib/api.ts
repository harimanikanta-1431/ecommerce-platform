import type {
  ApiResponse,
  AuthResponse,
  Cart,
  Category,
  Order,
  Paginated,
  Product,
  User,
} from "@/lib/types";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.API_URL ??
  "http://localhost:3001/api";

type QueryValue = string | number | boolean | undefined | null;

function buildUrl(path: string, query?: Record<string, QueryValue>) {
  const url = new URL(`${API_BASE_URL}${path}`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit & { query?: Record<string, QueryValue>; token?: string },
): Promise<T> {
  const { query, token, headers, ...requestInit } = init ?? {};
  const response = await fetch(buildUrl(path, query), {
    ...requestInit,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });
  const payload = (await response.json().catch(() => null)) as
    | ApiResponse<T>
    | null;

  if (!response.ok || !payload?.success) {
    const message = payload?.message;
    throw new Error(Array.isArray(message) ? message.join(", ") : message ?? "API request failed");
  }

  return payload.data;
}

export const catalogApi = {
  categories: () =>
    apiFetch<Paginated<Category>>("/categories", {
      next: { revalidate: 60 },
      query: { limit: 50 },
    }),
  products: (query?: Record<string, QueryValue>) =>
    apiFetch<Paginated<Product>>("/products", {
      next: { revalidate: 30 },
      query,
    }),
  featured: () =>
    apiFetch<Product[]>("/products/featured", {
      next: { revalidate: 60 },
      query: { limit: 8 },
    }),
  trending: () =>
    apiFetch<Product[]>("/products/trending", {
      next: { revalidate: 60 },
      query: { limit: 8 },
    }),
  productBySlug: (slug: string) =>
    apiFetch<Product>(`/products/slug/${slug}`, {
      next: { revalidate: 30 },
    }),
  related: async (product: Product) => {
    const products = await catalogApi.products({
      category: product.category.slug,
      limit: 4,
      sort: "popularity",
    });

    return products.data.filter((item) => item.id !== product.id).slice(0, 4);
  },
};

export const authApi = {
  login: (email: string, password: string) =>
    apiFetch<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  register: (body: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    country?: string;
  }) =>
    apiFetch<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  me: (token: string) => apiFetch<User>("/auth/me", { token }),
};

export const cartApi = {
  get: (token: string) => apiFetch<Cart>("/cart", { token, cache: "no-store" }),
  add: (token: string, productId: string, quantity = 1) =>
    apiFetch<Cart>("/cart/items", {
      token,
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
    }),
  update: (token: string, itemId: string, quantity: number) =>
    apiFetch<Cart>(`/cart/items/${itemId}`, {
      token,
      method: "PATCH",
      body: JSON.stringify({ quantity }),
    }),
  remove: (token: string, itemId: string) =>
    apiFetch<Cart>(`/cart/items/${itemId}`, {
      token,
      method: "DELETE",
    }),
};

export const orderApi = {
  mine: (token: string) =>
    apiFetch<Order[]>("/orders/mine", { token, cache: "no-store" }),
  place: (
    token: string,
    body: {
      couponCode?: string;
      address: {
        fullName: string;
        phone: string;
        line1: string;
        line2?: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
      };
    },
  ) =>
    apiFetch<Order>("/orders", {
      token,
      method: "POST",
      body: JSON.stringify(body),
    }),
  pay: (token: string, orderId: string) =>
    apiFetch("/payments", {
      token,
      method: "POST",
      body: JSON.stringify({ orderId, provider: "COD" }),
    }),
};

export const wishlistApi = {
  get: (token: string) => apiFetch<{ items: Array<{ product: Product }> }>("/wishlist", { token }),
  add: (token: string, productId: string) =>
    apiFetch("/wishlist/items", {
      token,
      method: "POST",
      body: JSON.stringify({ productId }),
    }),
  remove: (token: string, productId: string) =>
    apiFetch(`/wishlist/items/${productId}`, {
      token,
      method: "DELETE",
    }),
};
