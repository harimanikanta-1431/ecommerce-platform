import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { StatCardComponent } from '../../components/stat-card/stat-card.component';
import { LoadingSkeletonComponent } from '../../components/loading-skeleton/loading-skeleton.component';
import { DashboardStats, Order } from '../../models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, StatCardComponent, LoadingSkeletonComponent],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-gray-600 mt-1">Welcome back! Here's your eCommerce overview.</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ng-container *ngIf="stats(); else skeletons">

          <app-stat-card
            title="Total Revenue"
            [value]="'$' + (stats()?.totalRevenue ?? 0).toLocaleString()"
            [growth]="stats()?.revenueGrowth ?? 0"
            iconBg="bg-blue-100"
            [icon]="getDollarIcon()"
          ></app-stat-card>

          <app-stat-card
            title="Total Orders"
            [value]="(stats()?.totalOrders ?? 0).toString()"
            [growth]="stats()?.ordersGrowth ?? 0"
            iconBg="bg-green-100"
            [icon]="getCartIcon()"
          ></app-stat-card>

          <app-stat-card
            title="Total Users"
            [value]="(stats()?.totalUsers ?? 0).toString()"
            [growth]="stats()?.usersGrowth ?? 0"
            iconBg="bg-purple-100"
            [icon]="getUserIcon()"
          ></app-stat-card>

          <app-stat-card
            title="Total Products"
            [value]="(stats()?.totalProducts ?? 0).toString()"
            [growth]="stats()?.productsGrowth ?? 0"
            iconBg="bg-orange-100"
            [icon]="getProductIcon()"
          ></app-stat-card>

        </ng-container>

        <ng-template #skeletons>
          <app-loading-skeleton type="card"></app-loading-skeleton>
          <app-loading-skeleton type="card"></app-loading-skeleton>
          <app-loading-skeleton type="card"></app-loading-skeleton>
          <app-loading-skeleton type="card"></app-loading-skeleton>
        </ng-template>
      </div>

      <!-- Recent Orders -->
      <div class="bg-white rounded-lg shadow border border-gray-100">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-lg font-bold text-gray-900">Recent Orders</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-4 text-left text-sm font-semibold">Order ID</th>
                <th class="px-6 py-4 text-left text-sm font-semibold">Customer</th>
                <th class="px-6 py-4 text-left text-sm font-semibold">Amount</th>
                <th class="px-6 py-4 text-left text-sm font-semibold">Status</th>
                <th class="px-6 py-4 text-left text-sm font-semibold">Date</th>
              </tr>
            </thead>

            <tbody>
              <tr *ngFor="let order of recentOrders()" class="border-b hover:bg-gray-50">
                <td class="px-6 py-4 text-blue-600 font-semibold">
                  {{ order.orderId }}
                </td>

                <td class="px-6 py-4">
                  {{ order.userName }}
                </td>

                <td class="px-6 py-4 font-semibold">
                  {{ '$' + order.amount.toFixed(2) }}
                </td>

                <td class="px-6 py-4">
                  <span class="px-2 py-1 rounded text-xs"
                    [ngClass]="{
                      'bg-green-100 text-green-800': order.status === 'delivered',
                      'bg-blue-100 text-blue-800': order.status === 'shipped',
                      'bg-yellow-100 text-yellow-800': order.status === 'pending'
                    }"
                  >
                    {{ order.status }}
                  </span>
                </td>

                <td class="px-6 py-4 text-gray-500">
                  {{ order.date | date:'short' }}
                </td>
              </tr>
            </tbody>

          </table>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {

  stats = signal<DashboardStats | null>(null);
  recentOrders = signal<Order[]>([]);

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getStats().subscribe(data => {
      this.stats.set(data);
    });

    this.dataService.getRecentOrders().subscribe(data => {
      this.recentOrders.set(data);
    });
  }

  getDollarIcon() { return ''; }
  getCartIcon() { return ''; }
  getUserIcon() { return ''; }
  getProductIcon() { return ''; }
}
