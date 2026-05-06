import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Category, Product } from '../../models';
import { ModalComponent } from '../../components/modal/modal.component';
import { LoadingSkeletonComponent } from '../../components/loading-skeleton/loading-skeleton.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent, LoadingSkeletonComponent],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Products</h1>
          <p class="text-gray-600 mt-1">Manage your product catalog</p>
        </div>
        <button
          (click)="openAddModal()"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Add Product
        </button>
      </div>

      <!-- Products Table -->
      <div class="bg-white rounded-lg shadow border border-gray-100">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="text-left px-6 py-4 text-sm font-semibold text-gray-900">Product</th>
                <th class="text-left px-6 py-4 text-sm font-semibold text-gray-900">Price</th>
                <th class="text-left px-6 py-4 text-sm font-semibold text-gray-900">Stock</th>
                <th class="text-left px-6 py-4 text-sm font-semibold text-gray-900">Category</th>
                <th class="text-left px-6 py-4 text-sm font-semibold text-gray-900">Rating</th>
                <th class="text-left px-6 py-4 text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              <ng-container *ngIf="products(); else loadingRows">
                <tr *ngFor="let product of products()" class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <img
                        [src]="product.image"
                        [alt]="product.name"
                        class="w-10 h-10 rounded bg-gray-100 object-cover"
                      />
                      <div>
                        <p class="font-semibold text-gray-900">{{ product.name }}</p>
                        <p class="text-xs text-gray-500">{{ product.description }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 font-semibold text-gray-900">{{ '$' + product.price.toFixed(2) }}</td>
                  <td class="px-6 py-4">
                    <span
                      class="px-3 py-1 text-xs font-semibold rounded-full"
                      [ngClass]="product.stock > 50 ? 'bg-green-100 text-green-800' : product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'"
                    >
                      {{ product.stock }} units
                    </span>
                  </td>
                  <td class="px-6 py-4 text-gray-600">{{ product.category }}</td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-1">
                      <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                      <span class="text-sm font-semibold text-gray-900">{{ product.rating }}</span>
                      <span class="text-xs text-gray-500">({{ product.reviews }})</span>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex gap-2">
                      <button
                        (click)="editProduct(product)"
                        class="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        (click)="deleteProduct(product.id)"
                        class="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
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

    <!-- Add/Edit Modal -->
    <app-modal
      [isOpen]="showModal()"
      [title]="editingProduct() ? 'Edit Product' : 'Add New Product'"
      [confirmText]="editingProduct() ? 'Update' : 'Add'"
      (onClose)="closeModal()"
      (onConfirm)="saveProduct()"
    >
      <form class="space-y-4">
        <div>
          <label class="block text-sm font-semibold text-gray-900 mb-2">Product Name</label>
          <input
            type="text"
            [(ngModel)]="formData.name"
            name="name"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter product name"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-900 mb-2">Description</label>
          <textarea
            [(ngModel)]="formData.description"
            name="description"
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter product description"
          ></textarea>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold text-gray-900 mb-2">Price</label>
            <input
              type="number"
              [(ngModel)]="formData.price"
              name="price"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-900 mb-2">Stock</label>
            <input
              type="number"
              [(ngModel)]="formData.stock"
              name="stock"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-900 mb-2">Category</label>
          <select
            [(ngModel)]="formData.categoryId"
            name="categoryId"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select category</option>
            <option *ngFor="let category of categories()" [value]="category.id">{{ category.name }}</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-900 mb-2">Image URL</label>
          <input
            type="url"
            [(ngModel)]="formData.image"
            name="image"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com/product.jpg"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-900 mb-2">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            (change)="onImageSelected($event)"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p *ngIf="uploadingImage()" class="text-xs text-blue-600 mt-2">Uploading image...</p>
        </div>
      </form>
    </app-modal>
  `,
  styles: []
})
export class ProductsComponent implements OnInit {
  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  showModal = signal(false);
  editingProduct = signal<Product | null>(null);
  uploadingImage = signal(false);
  formData = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    categoryId: '',
    image: ''
  };

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.dataService.getProducts().subscribe(data => {
      this.products.set(data);
    });
  }

  loadCategories(): void {
    this.dataService.getCategories().subscribe(data => {
      this.categories.set(data);
    });
  }

  openAddModal(): void {
    this.editingProduct.set(null);
    this.formData = {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      categoryId: this.categories()[0]?.id ?? '',
      image: ''
    };
    this.showModal.set(true);
  }

  editProduct(product: Product): void {
    this.editingProduct.set(product);
    this.formData = {
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId,
      image: product.image
    };
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editingProduct.set(null);
  }

  saveProduct(): void {
    if (!this.formData.categoryId) {
      return;
    }

    const request = this.editingProduct()
      ? this.dataService.updateProduct(this.editingProduct()!.id, this.formData)
      : this.dataService.createProduct(this.formData);

    request.subscribe(product => {
      if (this.editingProduct()) {
        this.products.set(this.products().map(item => item.id === product.id ? product : item));
      } else {
        this.products.set([product, ...this.products()]);
      }
      this.closeModal();
    });
  }

  deleteProduct(id: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.dataService.deleteProduct(id).subscribe(() => {
        this.products.set(this.products().filter(p => p.id !== id));
      });
    }
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    this.uploadingImage.set(true);
    this.dataService.uploadImage(file).subscribe({
      next: result => {
        this.formData.image = result.url;
        this.uploadingImage.set(false);
      },
      error: () => this.uploadingImage.set(false)
    });
  }
}
