import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  template: `
    <div class="w-64 bg-gray-900 text-white min-h-screen p-4 flex flex-col">
      <!-- Logo -->
      <div class="flex items-center gap-3 mb-8">
        <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center font-bold">
          AD
        </div>
        <span class="text-xl font-bold">AdminHub</span>
      </div>

      <!-- Navigation Menu -->
      <nav class="flex-1 space-y-2">
        <a
          routerLink="/dashboard"
          routerLinkActive="bg-blue-600"
          [routerLinkActiveOptions]="{ exact: true }"
          class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4z"></path>
            <path d="M3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6z"></path>
            <path d="M14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
          </svg>
          <span>Dashboard</span>
        </a>

        <a
          routerLink="/products"
          routerLinkActive="bg-blue-600"
          class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 6H6.28l-.31-1.243A1 1 0 005 4H3z"></path>
            <path d="M16 16a2 2 0 11-4 0 2 2 0 014 0z"></path>
            <path d="M6 16a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
          <span>Products</span>
        </a>

        <a
          routerLink="/orders"
          routerLinkActive="bg-blue-600"
          class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4z"></path>
          </svg>
          <span>Orders</span>
        </a>

        <a
          routerLink="/users"
          routerLinkActive="bg-blue-600"
          class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM9 6a3 3 0 11-6 0 3 3 0 016 0z"></path>
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0z"></path>
            <path d="M17 9a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
          <span>Users</span>
        </a>

        <a
          routerLink="/categories"
          routerLinkActive="bg-blue-600"
          class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM15 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2h-2zM5 13a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5z"></path>
          </svg>
          <span>Categories</span>
        </a>
      </nav>

      <!-- Footer -->
      <div class="border-t border-gray-700 pt-4">
        <button (click)="logout()" class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors w-full text-left">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1h12a1 1 0 110 2H4v11a1 1 0 11-2 0V4a1 1 0 011-1h12z" clip-rule="evenodd"></path>
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </div>
  `,
  styles: []
})
export class SidebarComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
