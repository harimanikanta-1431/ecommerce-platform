import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  ApiResponse,
  Category,
  DashboardStats,
  Order,
  Paginated,
  Product,
  User
} from '../models';

type BackendCategory = {
  id: string;
  name: string;
  description?: string;
  productCount: number;
  createdAt: string;
};

type BackendProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  category: BackendCategory;
  images: string[];
  rating: number;
  reviewCount: number;
};

type BackendOrder = {
  id: string;
  orderNumber: string;
  userId: string;
  user: { id: string; name: string; email: string };
  amount: number;
  status: string;
  createdAt: string;
  items: unknown[];
};

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getStats(): Observable<DashboardStats> {
    return this.get<DashboardStats>('/admin/dashboard/stats');
  }

  getProducts(search = ''): Observable<Product[]> {
    let params = new HttpParams().set('limit', 100);
    if (search) {
      params = params.set('search', search);
    }

    return this.get<Paginated<BackendProduct>>('/products', params).pipe(
      map(response => response.data.map(product => this.mapProduct(product)))
    );
  }

  createProduct(product: Partial<Product>): Observable<Product> {
    return this.post<BackendProduct>('/products', {
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId,
      images: product.image ? [product.image] : []
    }).pipe(map(product => this.mapProduct(product)));
  }

  updateProduct(id: string, product: Partial<Product>): Observable<Product> {
    return this.patch<BackendProduct>(`/products/${id}`, {
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId,
      images: product.image ? [product.image] : undefined
    }).pipe(map(updated => this.mapProduct(updated)));
  }

  deleteProduct(id: string): Observable<{ id: string }> {
    return this.delete<{ id: string }>(`/products/${id}`);
  }

  getOrders(): Observable<Order[]> {
    return this.get<Paginated<BackendOrder>>('/orders').pipe(
      map(response => response.data.map(order => this.mapOrder(order)))
    );
  }

  updateOrderStatus(id: string, status: Order['status']): Observable<Order> {
    return this.patch<BackendOrder>(`/orders/${id}/status`, {
      status: status.toUpperCase()
    }).pipe(map(order => this.mapOrder(order)));
  }

  getUsers(): Observable<User[]> {
    return this.get<Paginated<User>>('/users').pipe(map(response => response.data));
  }

  updateUser(id: string, user: Partial<User>): Observable<User> {
    return this.patch<User>(`/users/${id}`, user);
  }

  getCategories(): Observable<Category[]> {
    return this.get<Paginated<BackendCategory>>('/categories', new HttpParams().set('limit', 100)).pipe(
      map(response => response.data.map(category => ({
        id: category.id,
        name: category.name,
        description: category.description ?? '',
        productCount: category.productCount,
        createdAt: category.createdAt
      })))
    );
  }

  createCategory(category: Partial<Category>): Observable<Category> {
    return this.post<BackendCategory>('/categories', category).pipe(
      map(created => ({
        id: created.id,
        name: created.name,
        description: created.description ?? '',
        productCount: created.productCount,
        createdAt: created.createdAt
      }))
    );
  }

  updateCategory(id: string, category: Partial<Category>): Observable<Category> {
    return this.patch<BackendCategory>(`/categories/${id}`, category).pipe(
      map(updated => ({
        id: updated.id,
        name: updated.name,
        description: updated.description ?? '',
        productCount: updated.productCount,
        createdAt: updated.createdAt
      }))
    );
  }

  deleteCategory(id: string): Observable<{ id: string }> {
    return this.delete<{ id: string }>(`/categories/${id}`);
  }

  getRecentOrders(): Observable<Order[]> {
    return this.get<BackendOrder[]>('/admin/dashboard/recent-orders').pipe(
      map(orders => orders.map(order => this.mapOrder(order)))
    );
  }

  uploadImage(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http
      .post<ApiResponse<{ url: string }>>(`${this.apiUrl}/uploads/image`, formData)
      .pipe(map(response => response.data));
  }

  private get<T>(path: string, params?: HttpParams): Observable<T> {
    return this.http
      .get<ApiResponse<T>>(`${this.apiUrl}${path}`, { params })
      .pipe(map(response => response.data));
  }

  private post<T>(path: string, body: unknown): Observable<T> {
    return this.http
      .post<ApiResponse<T>>(`${this.apiUrl}${path}`, body)
      .pipe(map(response => response.data));
  }

  private patch<T>(path: string, body: unknown): Observable<T> {
    return this.http
      .patch<ApiResponse<T>>(`${this.apiUrl}${path}`, body)
      .pipe(map(response => response.data));
  }

  private delete<T>(path: string): Observable<T> {
    return this.http
      .delete<ApiResponse<T>>(`${this.apiUrl}${path}`)
      .pipe(map(response => response.data));
  }

  private mapProduct(product: BackendProduct): Product {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId,
      category: product.category?.name ?? 'Uncategorized',
      image: product.images?.[0] ?? 'https://placehold.co/150x150?text=Product',
      rating: product.rating,
      reviews: product.reviewCount
    };
  }

  private mapOrder(order: BackendOrder): Order {
    return {
      id: order.id,
      orderId: order.orderNumber,
      userId: order.userId,
      userName: order.user?.name ?? 'Customer',
      amount: order.amount,
      status: order.status.toLowerCase() as Order['status'],
      date: order.createdAt,
      items: order.items.length
    };
  }
}
