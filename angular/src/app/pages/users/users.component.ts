import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { User } from '../../models';
import { LoadingSkeletonComponent } from '../../components/loading-skeleton/loading-skeleton.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, LoadingSkeletonComponent],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Users</h1>
        <p class="text-gray-600 mt-1">Manage customer accounts</p>
      </div>

      <!-- Users Table -->
      <div class="bg-white rounded-lg shadow border border-gray-100">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="text-left px-6 py-4 text-sm font-semibold text-gray-900">Name</th>
                <th class="text-left px-6 py-4 text-sm font-semibold text-gray-900">Email</th>
                <th class="text-left px-6 py-4 text-sm font-semibold text-gray-900">Phone</th>
                <th class="text-left px-6 py-4 text-sm font-semibold text-gray-900">Country</th>
                <th class="text-left px-6 py-4 text-sm font-semibold text-gray-900">Status</th>
                <th class="text-left px-6 py-4 text-sm font-semibold text-gray-900">Joined</th>
                <th class="text-left px-6 py-4 text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              <ng-container *ngIf="users(); else loadingRows">
                <tr *ngFor="let user of users()" class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                        {{ user.name.charAt(0) }}
                      </div>
                      <p class="font-semibold text-gray-900">{{ user.name }}</p>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-600">{{ user.email }}</td>
                  <td class="px-6 py-4 text-sm text-gray-600">{{ user.phone }}</td>
                  <td class="px-6 py-4 text-sm text-gray-600">{{ user.country }}</td>
                  <td class="px-6 py-4">
                    <span
                      class="px-3 py-1 text-xs font-semibold rounded-full"
                      [ngClass]="user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                    >
                      {{ user.status | titlecase }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-600">{{ user.createdAt | date: 'short' }}</td>
                  <td class="px-6 py-4">
                    <div class="flex gap-2">
                      <button
                        (click)="toggleUserStatus(user.id)"
                        class="px-3 py-1 text-sm text-orange-600 hover:bg-orange-50 rounded transition-colors"
                      >
                        {{ user.status === 'ACTIVE' ? 'Deactivate' : 'Activate' }}
                      </button>
                    </div>
                  </td>
                </tr>
              </ng-container>

              <ng-template #loadingRows>
                <tr *ngFor="let i of [1,2,3,4,5]">
                  <td colspan="7" class="px-6 py-4">
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
export class UsersComponent implements OnInit {
  users = signal<User[]>([]);

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.dataService.getUsers().subscribe(data => {
      this.users.set(data);
    });
  }

  toggleUserStatus(userId: string): void {
    const user = this.users().find(item => item.id === userId);

    if (!user) {
      return;
    }

    const status: User['status'] = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    this.dataService.updateUser(userId, { status }).subscribe(updatedUser => {
      this.users.set(this.users().map(item => item.id === userId ? updatedUser : item));
    });
  }
}
