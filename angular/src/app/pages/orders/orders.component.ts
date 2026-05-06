import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { Order } from '../../models';
import { LoadingSkeletonComponent } from '../../components/loading-skeleton/loading-skeleton.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, LoadingSkeletonComponent , FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Orders</h1>
        <p class="text-gray-600 mt-1">Manage and track customer orders</p>
      </div>

      <!-- Orders Table -->
      <div class="bg-white rounded-lg shadow border border-gray-100">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="text-left px-6 py-4 text-sm font-semibold text-gray-900">Order ID</th>
                <th class="text-left px-6 py-4 text-sm font-semibold text-gray-900">Customer</th>
                <th class="text-left px-6 py-4 text-sm font-semibold text-gray-900">Amount</th>
                <th class="text-left px-6 py-4 text-sm font-semibold text-gray-900">Items</th>
                <th class="text-left px-6 py-4 text-sm font-semibold text-gray-900">Status</th>
                <th class="text-left px-6 py-4 text-sm font-semibold text-gray-900">Date</th>
              </tr>
            </thead>
            <tbody>
              <ng-container *ngIf="orders(); else loadingRows">
                <tr *ngFor="let order of orders()" class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 text-sm font-semibold text-blue-600">{{ order.orderId }}</td>
                  <td class="px-6 py-4 text-sm text-gray-900">
                    <div>
                      <p class="font-semibold">{{ order.userName }}</p>
                      <p class="text-xs text-gray-500">ID: {{ order.userId }}</p>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm font-semibold text-gray-900">{{ '$' + order.amount.toFixed(2) }}</td>
                  <td class="px-6 py-4 text-sm text-gray-600">{{ order.items }} item(s)</td>
                  <td class="px-6 py-4">
                    <select
                      [(ngModel)]="order.status"
                      (change)="updateOrderStatus(order.id, order.status)"
                      class="px-3 py-1 text-xs font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      [ngClass]="{
                        'bg-green-100 text-green-800': order.status === 'delivered',
                        'bg-blue-100 text-blue-800': order.status === 'shipped',
                        'bg-indigo-100 text-indigo-800': order.status === 'paid' || order.status === 'processing',
                        'bg-yellow-100 text-yellow-800': order.status === 'pending',
                        'bg-red-100 text-red-800': order.status === 'cancelled' || order.status === 'refunded'
                      }"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-600">{{ order.date | date: 'short' }}</td>
                </tr>
              </ng-container>

              <ng-template #loadingRows>
                <tr *ngFor="let i of [1,2,3,4,5]">
                  <td colspan="6" class="px-6 py-4">
                    <app-loading-skeleton type="table-row"></app-loading-skeleton>
                  </td>
                </tr>
              </ng-template>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class OrdersComponent implements OnInit {
  orders = signal<Order[]>([]);

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.dataService.getOrders().subscribe(data => {
      this.orders.set(data);
    });
  }

  updateOrderStatus(orderId: string, newStatus: string): void {
    this.dataService.updateOrderStatus(orderId, newStatus as Order['status']).subscribe(updatedOrder => {
      this.orders.set(this.orders().map(order => order.id === updatedOrder.id ? updatedOrder : order));
    });
  }
}
