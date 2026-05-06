import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Category } from '../../models';
import { ModalComponent } from '../../components/modal/modal.component';
import { LoadingSkeletonComponent } from '../../components/loading-skeleton/loading-skeleton.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent, LoadingSkeletonComponent],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Categories</h1>
          <p class="text-gray-600 mt-1">Organize your products</p>
        </div>
        <button
          (click)="openAddModal()"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Add Category
        </button>
      </div>

      <!-- Categories Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" *ngIf="categories(); else loadingCards">
        <div *ngFor="let category of categories()" class="bg-white rounded-lg shadow p-6 border border-gray-100 hover:shadow-lg transition-shadow">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h3 class="text-lg font-bold text-gray-900">{{ category.name }}</h3>
              <p class="text-sm text-gray-600 mt-1">{{ category.description }}</p>
            </div>
            <div class="flex gap-2">
              <button
                (click)="editCategory(category)"
                class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </button>
              <button
                (click)="deleteCategory(category.id)"
                class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>

          <div class="pt-4 border-t border-gray-200">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Products</span>
              <span class="text-lg font-bold text-blue-600">{{ category.productCount }}</span>
            </div>
            <p class="text-xs text-gray-500 mt-2">Created {{ category.createdAt | date: 'short' }}</p>
          </div>
        </div>
      </div>

      <ng-template #loadingCards>
        <app-loading-skeleton type="card"></app-loading-skeleton>
        <app-loading-skeleton type="card"></app-loading-skeleton>
        <app-loading-skeleton type="card"></app-loading-skeleton>
      </ng-template>
    </div>

    <!-- Add/Edit Modal -->
    <app-modal
      [isOpen]="showModal()"
      [title]="editingCategory() ? 'Edit Category' : 'Add New Category'"
      [confirmText]="editingCategory() ? 'Update' : 'Add'"
      (onClose)="closeModal()"
      (onConfirm)="saveCategory()"
    >
      <form class="space-y-4">
        <div>
          <label class="block text-sm font-semibold text-gray-900 mb-2">Category Name</label>
          <input
            type="text"
            [(ngModel)]="formData.name"
            name="name"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter category name"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-900 mb-2">Description</label>
          <textarea
            [(ngModel)]="formData.description"
            name="description"
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter category description"
          ></textarea>
        </div>
      </form>
    </app-modal>
  `,
  styles: []
})
export class CategoriesComponent implements OnInit {
  categories = signal<Category[]>([]);
  showModal = signal(false);
  editingCategory = signal<Category | null>(null);
  formData = {
    name: '',
    description: ''
  };

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.dataService.getCategories().subscribe(data => {
      this.categories.set(data);
    });
  }

  openAddModal(): void {
    this.editingCategory.set(null);
    this.formData = { name: '', description: '' };
    this.showModal.set(true);
  }

  editCategory(category: Category): void {
    this.editingCategory.set(category);
    this.formData = {
      name: category.name,
      description: category.description
    };
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editingCategory.set(null);
  }

  saveCategory(): void {
    const request = this.editingCategory()
      ? this.dataService.updateCategory(this.editingCategory()!.id, this.formData)
      : this.dataService.createCategory(this.formData);

    request.subscribe(category => {
      if (this.editingCategory()) {
        this.categories.set(this.categories().map(item => item.id === category.id ? category : item));
      } else {
        this.categories.set([...this.categories(), category]);
      }
      this.closeModal();
    });
  }

  deleteCategory(id: string): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.dataService.deleteCategory(id).subscribe(() => {
        this.categories.set(this.categories().filter(c => c.id !== id));
      });
    }
  }
}
