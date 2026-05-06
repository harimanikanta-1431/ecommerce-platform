import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div class="w-full max-w-md bg-white rounded-xl shadow border border-gray-100 p-8">
        <div class="text-center mb-8">
          <div class="w-14 h-14 rounded-xl bg-blue-600 text-white grid place-items-center mx-auto font-bold text-xl">
            AD
          </div>
          <h1 class="text-3xl font-bold text-gray-900 mt-4">Admin Login</h1>
          <p class="text-gray-600 mt-2">Sign in to manage VistaMart</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="login()" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-900 mb-2">Email</label>
            <input
              type="email"
              formControlName="email"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-900 mb-2">Password</label>
            <input
              type="password"
              formControlName="password"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div *ngIf="error()" class="bg-red-50 text-red-700 text-sm rounded-lg p-3">
            {{ error() }}
          </div>

          <button
            type="submit"
            [disabled]="form.invalid || loading()"
            class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60"
          >
            {{ loading() ? 'Signing in...' : 'Sign in' }}
          </button>
        </form>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = signal(false);
  error = signal('');
  form = this.fb.group({
    email: ['admin@vistamart.test', [Validators.required, Validators.email]],
    password: ['Admin123!', [Validators.required]]
  });

  login(): void {
    if (this.form.invalid) {
      return;
    }

    this.loading.set(true);
    this.error.set('');

    const { email, password } = this.form.getRawValue();
    this.authService.login(email ?? '', password ?? '').subscribe({
      next: session => {
        if (session.user.role !== 'ADMIN') {
          this.authService.logout();
          this.error.set('Only admin users can access this dashboard.');
          this.loading.set(false);
          return;
        }
        this.router.navigateByUrl('/dashboard');
      },
      error: error => {
        this.error.set(error?.error?.message ?? 'Login failed');
        this.loading.set(false);
      }
    });
  }
}
