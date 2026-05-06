// User model
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  createdAt: string;
  status: 'ACTIVE' | 'INACTIVE';
  role: 'ADMIN' | 'CUSTOMER';
}

// Product model
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  categoryId: string;
  image: string;
  rating: number;
  reviews: number;
}

// Order model
export interface Order {
  id: string;
  orderId: string;
  userId: string;
  userName: string;
  amount: number;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  date: string;
  items: number;
}

// Category model
export interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
  createdAt: string;
}

// Stats model
export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  revenueGrowth: number;
  ordersGrowth: number;
  usersGrowth: number;
  productsGrowth: number;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'CUSTOMER';
  status: 'ACTIVE' | 'INACTIVE';
}

export interface AuthSession {
  accessToken: string;
  user: AuthUser;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string | string[];
}

export interface Paginated<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
