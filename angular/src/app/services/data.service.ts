import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DashboardStats, Product, Order, User, Category } from '../models';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  getStats(): Observable<DashboardStats> {
    return of({
      totalRevenue: 125432,
      totalOrders: 3420,
      totalUsers: 8934,
      totalProducts: 456,
      revenueGrowth: 12.5,
      ordersGrowth: 8.3,
      usersGrowth: 15.2,
      productsGrowth: 5.8
    });
  }

  getProducts(): Observable<Product[]> {
    return of([
      {
        id: '1',
        name: 'Wireless Headphones',
        description: 'Premium noise-cancelling headphones',
        price: 199.99,
        stock: 45,
        category: 'Electronics',
        image: 'https://via.placeholder.com/150?text=Headphones',
        rating: 4.5,
        reviews: 128
      },
      {
        id: '2',
        name: 'USB-C Cable',
        description: 'Fast charging cable 2m',
        price: 19.99,
        stock: 320,
        category: 'Accessories',
        image: 'https://via.placeholder.com/150?text=Cable',
        rating: 4.2,
        reviews: 89
      },
      {
        id: '3',
        name: 'Laptop Stand',
        description: 'Adjustable aluminum stand',
        price: 49.99,
        stock: 120,
        category: 'Office',
        image: 'https://via.placeholder.com/150?text=Stand',
        rating: 4.7,
        reviews: 234
      },
      {
        id: '4',
        name: 'Mechanical Keyboard',
        description: 'RGB mechanical keyboard',
        price: 129.99,
        stock: 78,
        category: 'Electronics',
        image: 'https://via.placeholder.com/150?text=Keyboard',
        rating: 4.6,
        reviews: 456
      },
      {
        id: '5',
        name: 'Wireless Mouse',
        description: 'Ergonomic wireless mouse',
        price: 39.99,
        stock: 5,
        category: 'Electronics',
        image: 'https://via.placeholder.com/150?text=Mouse',
        rating: 4.3,
        reviews: 267
      }
    ]);
  }

  getOrders(): Observable<Order[]> {
    return of([
      {
        id: '1',
        orderId: '#ORD001234',
        userId: 'U001',
        userName: 'John Doe',
        amount: 299.99,
        status: 'delivered',
        date: new Date('2024-01-15'),
        items: 3
      },
      {
        id: '2',
        orderId: '#ORD001235',
        userId: 'U002',
        userName: 'Jane Smith',
        amount: 149.99,
        status: 'shipped',
        date: new Date('2024-01-18'),
        items: 2
      },
      {
        id: '3',
        orderId: '#ORD001236',
        userId: 'U003',
        userName: 'Robert Johnson',
        amount: 599.99,
        status: 'pending',
        date: new Date('2024-01-20'),
        items: 5
      },
      {
        id: '4',
        orderId: '#ORD001237',
        userId: 'U004',
        userName: 'Emily Brown',
        amount: 89.99,
        status: 'delivered',
        date: new Date('2024-01-21'),
        items: 1
      },
      {
        id: '5',
        orderId: '#ORD001238',
        userId: 'U005',
        userName: 'Michael Davis',
        amount: 449.99,
        status: 'pending',
        date: new Date('2024-01-22'),
        items: 4
      }
    ]);
  }

  getUsers(): Observable<User[]> {
    return of([
      {
        id: '1',
        name: 'John Doe',
        email: 'john.doe&#64;example.com',
        phone: '+1 (555) 123-4567',
        country: 'United States',
        createdAt: new Date('2023-06-15'),
        status: 'active'
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane.smith&#64;example.com',
        phone: '+1 (555) 234-5678',
        country: 'Canada',
        createdAt: new Date('2023-07-20'),
        status: 'active'
      },
      {
        id: '3',
        name: 'Robert Johnson',
        email: 'robert.j&#64;example.com',
        phone: '+44 (0)20 7946 0958',
        country: 'United Kingdom',
        createdAt: new Date('2023-08-10'),
        status: 'active'
      },
      {
        id: '4',
        name: 'Emily Brown',
        email: 'emily.brown&#64;example.com',
        phone: '+61 (0)2 1234 5678',
        country: 'Australia',
        createdAt: new Date('2023-09-05'),
        status: 'inactive'
      },
      {
        id: '5',
        name: 'Michael Davis',
        email: 'michael.d&#64;example.com',
        phone: '+1 (555) 345-6789',
        country: 'United States',
        createdAt: new Date('2023-10-12'),
        status: 'active'
      }
    ]);
  }

  getCategories(): Observable<Category[]> {
    return of([
      {
        id: '1',
        name: 'Electronics',
        description: 'Electronic devices and gadgets',
        productCount: 234,
        createdAt: new Date('2023-01-10')
      },
      {
        id: '2',
        name: 'Accessories',
        description: 'Phone and computer accessories',
        productCount: 156,
        createdAt: new Date('2023-02-15')
      },
      {
        id: '3',
        name: 'Office',
        description: 'Office furniture and supplies',
        productCount: 89,
        createdAt: new Date('2023-03-20')
      },
      {
        id: '4',
        name: 'Home & Garden',
        description: 'Home and garden products',
        productCount: 312,
        createdAt: new Date('2023-04-05')
      }
    ]);
  }

  getRecentOrders(): Observable<Order[]> {
    return of([
      {
        id: '1',
        orderId: '#ORD001234',
        userId: 'U001',
        userName: 'John Doe',
        amount: 299.99,
        status: 'delivered',
        date: new Date('2024-01-20'),
        items: 3
      },
      {
        id: '2',
        orderId: '#ORD001235',
        userId: 'U002',
        userName: 'Jane Smith',
        amount: 149.99,
        status: 'shipped',
        date: new Date('2024-01-21'),
        items: 2
      },
      {
        id: '3',
        orderId: '#ORD001236',
        userId: 'U003',
        userName: 'Robert Johnson',
        amount: 599.99,
        status: 'pending',
        date: new Date('2024-01-22'),
        items: 5
      }
    ]);
  }
}
