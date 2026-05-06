export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  productCount: number;
  createdAt?: string;
  updatedAt?: string;
};

export type Review = {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  title?: string;
  comment?: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
};

export type Product = {
  id: string;
  slug: string;
  sku?: string;
  name: string;
  categoryId: string;
  category: Category;
  description: string;
  details: string[];
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  popularity: number;
  stock: number;
  status: string;
  isFeatured: boolean;
  isTrending: boolean;
  images: string[];
  createdAt?: string;
  updatedAt?: string;
  reviews: Review[];
};

export type CartItem = {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
};

export type Cart = {
  id: string;
  userId: string;
  items: CartItem[];
  summary: {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
  };
};

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  role: "CUSTOMER" | "ADMIN";
  status: "ACTIVE" | "INACTIVE";
};

export type AuthResponse = {
  accessToken: string;
  user: User;
};

export type Order = {
  id: string;
  orderNumber: string;
  amount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  status: string;
  createdAt: string;
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    product: Product;
  }>;
  payment?: {
    id: string;
    status: string;
    provider: string;
    amount: number;
  };
};

export type Paginated<T> = {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
};

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string | string[];
};
