import { Component, HostListener, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { Order, Product, User } from '../../models';

type HeaderActivityItem = {
  id: string;
  title: string;
  description: string;
  time: string;
  route: string;
  unread: boolean;
};

type HeaderMessageItem = {
  id: string;
  from: string;
  subject: string;
  preview: string;
  time: string;
  route: string;
  unread: boolean;
};

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8">
      <!-- Search Bar -->
      <div class="flex-1 max-w-md">
        <div class="relative">
          <svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <input
            type="text"
            placeholder="Search..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <!-- Right Section -->
      <div class="flex items-center gap-6 ml-8">
        <!-- Notifications -->
        <div class="relative" (click)="$event.stopPropagation()">
          <button
            type="button"
            aria-label="Open notifications"
            (click)="toggleNotifications($event)"
            class="relative hover:text-blue-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
            </svg>
            <span
              *ngIf="notificationCount() > 0"
              class="absolute -top-2 -right-2 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold grid place-items-center"
            >
              {{ badge(notificationCount()) }}
            </span>
          </button>

          <div
            *ngIf="showNotifications()"
            class="absolute right-0 mt-4 w-96 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden"
          >
            <div class="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 class="font-bold text-gray-900">Notifications</h3>
                <p class="text-xs text-gray-500">Live store activity</p>
              </div>
              <button type="button" class="text-xs font-semibold text-blue-600 hover:text-blue-700" (click)="markNotificationsRead()">
                Mark read
              </button>
            </div>

            <div class="max-h-80 overflow-y-auto">
              <button
                *ngFor="let item of notifications()"
                type="button"
                (click)="openItem(item.route)"
                class="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex gap-3"
              >
                <span
                  class="mt-1 w-2 h-2 rounded-full flex-shrink-0"
                  [ngClass]="item.unread ? 'bg-red-500' : 'bg-gray-300'"
                ></span>
                <span class="min-w-0">
                  <span class="block text-sm font-semibold text-gray-900">{{ item.title }}</span>
                  <span class="block text-sm text-gray-600 mt-0.5">{{ item.description }}</span>
                  <span class="block text-xs text-gray-400 mt-1">{{ item.time }}</span>
                </span>
              </button>

              <div *ngIf="notifications().length === 0" class="px-4 py-8 text-center">
                <p class="font-semibold text-gray-900">No notifications</p>
                <p class="text-sm text-gray-500 mt-1">Orders and stock alerts will appear here.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Messages -->
        <div class="relative" (click)="$event.stopPropagation()">
          <button
            type="button"
            aria-label="Open messages"
            (click)="toggleMessages($event)"
            class="relative hover:text-blue-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            <span
              *ngIf="messageCount() > 0"
              class="absolute -top-2 -right-2 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold grid place-items-center"
            >
              {{ badge(messageCount()) }}
            </span>
          </button>

          <div
            *ngIf="showMessages()"
            class="absolute right-0 mt-4 w-96 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden"
          >
            <div class="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 class="font-bold text-gray-900">Messages</h3>
                <p class="text-xs text-gray-500">Customer and order updates</p>
              </div>
              <button type="button" class="text-xs font-semibold text-blue-600 hover:text-blue-700" (click)="markMessagesRead()">
                Mark read
              </button>
            </div>

            <div class="max-h-80 overflow-y-auto">
              <button
                *ngFor="let message of messages()"
                type="button"
                (click)="openItem(message.route)"
                class="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
              >
                <div class="flex items-start gap-3">
                  <div class="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {{ initials(message.from) }}
                  </div>
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center justify-between gap-3">
                      <p class="text-sm font-semibold text-gray-900 truncate">{{ message.from }}</p>
                      <span class="text-xs text-gray-400 flex-shrink-0">{{ message.time }}</span>
                    </div>
                    <p class="text-sm font-semibold text-gray-700 mt-0.5">{{ message.subject }}</p>
                    <p class="text-sm text-gray-500 mt-0.5 truncate">{{ message.preview }}</p>
                  </div>
                  <span *ngIf="message.unread" class="mt-2 w-2 h-2 rounded-full bg-red-500 flex-shrink-0"></span>
                </div>
              </button>

              <div *ngIf="messages().length === 0" class="px-4 py-8 text-center">
                <p class="font-semibold text-gray-900">No messages</p>
                <p class="text-sm text-gray-500 mt-1">Customer activity will appear here.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- User Profile Dropdown -->
        <div class="flex items-center gap-3">
          <div class="text-right">
            <p class="text-sm font-semibold text-gray-900">{{ authService.currentUser()?.name ?? 'Admin User' }}</p>
            <p class="text-xs text-gray-500">Administrator</p>
          </div>
          <div class="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold cursor-pointer hover:shadow-lg transition-shadow">
            AU
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class NavbarComponent implements OnInit {
  notifications = signal<HeaderActivityItem[]>([]);
  messages = signal<HeaderMessageItem[]>([]);
  showNotifications = signal(false);
  showMessages = signal(false);
  notificationCount = computed(() => this.notifications().filter(item => item.unread).length);
  messageCount = computed(() => this.messages().filter(item => item.unread).length);

  constructor(
    public authService: AuthService,
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadHeaderActivity();
  }

  @HostListener('document:click')
  closeMenus(): void {
    this.showNotifications.set(false);
    this.showMessages.set(false);
  }

  toggleNotifications(event: Event): void {
    event.stopPropagation();
    this.showNotifications.update(value => !value);
    this.showMessages.set(false);
  }

  toggleMessages(event: Event): void {
    event.stopPropagation();
    this.showMessages.update(value => !value);
    this.showNotifications.set(false);
  }

  markNotificationsRead(): void {
    this.notifications.update(items => items.map(item => ({ ...item, unread: false })));
  }

  markMessagesRead(): void {
    this.messages.update(items => items.map(item => ({ ...item, unread: false })));
  }

  openItem(route: string): void {
    this.showNotifications.set(false);
    this.showMessages.set(false);
    this.router.navigateByUrl(route);
  }

  badge(count: number): string {
    return count > 9 ? '9+' : String(count);
  }

  initials(name: string): string {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part.charAt(0).toUpperCase())
      .join('');
  }

  private loadHeaderActivity(): void {
    forkJoin({
      orders: this.dataService.getRecentOrders(),
      products: this.dataService.getProducts(),
      users: this.dataService.getUsers()
    }).subscribe(({ orders, products, users }) => {
      this.notifications.set(this.buildNotifications(orders, products, users));
      this.messages.set(this.buildMessages(orders, users));
    });
  }

  private buildNotifications(orders: Order[], products: Product[], users: User[]): HeaderActivityItem[] {
    const activeOrders = orders
      .filter(order => ['pending', 'paid', 'processing'].includes(order.status))
      .slice(0, 3)
      .map(order => ({
        id: `order-${order.id}`,
        title: 'Order needs attention',
        description: `${order.orderId} is ${order.status} from ${order.userName}.`,
        time: this.relativeTime(order.date),
        route: '/orders',
        unread: true
      }));

    const lowStockProducts = products
      .filter(product => product.stock <= 10)
      .slice(0, 3)
      .map(product => ({
        id: `product-${product.id}`,
        title: 'Low stock alert',
        description: `${product.name} has ${product.stock} unit${product.stock === 1 ? '' : 's'} left.`,
        time: 'Catalog',
        route: '/products',
        unread: product.stock <= 5
      }));

    const newestCustomers = users
      .filter(user => user.role === 'CUSTOMER')
      .slice(0, 2)
      .map(user => ({
        id: `user-${user.id}`,
        title: 'New customer account',
        description: `${user.name} joined the store.`,
        time: this.relativeTime(user.createdAt),
        route: '/users',
        unread: false
      }));

    return [...activeOrders, ...lowStockProducts, ...newestCustomers].slice(0, 6);
  }

  private buildMessages(orders: Order[], users: User[]): HeaderMessageItem[] {
    const orderMessages = orders.slice(0, 4).map(order => ({
      id: `message-order-${order.id}`,
      from: order.userName,
      subject: `Order ${order.orderId}`,
      preview: `${order.status} order for $${order.amount.toFixed(2)} with ${order.items} item${order.items === 1 ? '' : 's'}.`,
      time: this.relativeTime(order.date),
      route: '/orders',
      unread: ['pending', 'paid'].includes(order.status)
    }));

    const customerMessages = users
      .filter(user => user.role === 'CUSTOMER')
      .slice(0, 2)
      .map(user => ({
        id: `message-user-${user.id}`,
        from: user.name,
        subject: 'Customer profile',
        preview: user.email,
        time: this.relativeTime(user.createdAt),
        route: '/users',
        unread: false
      }));

    return [...orderMessages, ...customerMessages].slice(0, 5);
  }

  private relativeTime(value: string): string {
    const timestamp = new Date(value).getTime();

    if (Number.isNaN(timestamp)) {
      return 'Recently';
    }

    const diffMinutes = Math.max(Math.floor((Date.now() - timestamp) / 60000), 0);

    if (diffMinutes < 1) {
      return 'Just now';
    }

    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    }

    const diffHours = Math.floor(diffMinutes / 60);

    if (diffHours < 24) {
      return `${diffHours}h ago`;
    }

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  }
}
