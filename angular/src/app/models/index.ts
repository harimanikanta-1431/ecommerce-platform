// User model
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  createdAt: Date;
  status: string;
}

// Product model
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
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
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  date: Date;
  items: number;
}

// Category model
export interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
  createdAt: Date;
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
