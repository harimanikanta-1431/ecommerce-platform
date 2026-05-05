import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="animate-pulse">
      <div *ngIf="type === 'card'" class="bg-gray-200 rounded-lg h-32 mb-4"></div>
      <div *ngIf="type === 'table-row'" class="flex gap-4 mb-4">
        <div class="flex-1 bg-gray-200 rounded h-10"></div>
        <div class="flex-1 bg-gray-200 rounded h-10"></div>
        <div class="flex-1 bg-gray-200 rounded h-10"></div>
      </div>
      <div *ngIf="type === 'text'" class="bg-gray-200 rounded h-4 w-3/4 mb-2"></div>
    </div>
  `,
  styles: []
})
export class LoadingSkeletonComponent {
  @Input() type: 'card' | 'table-row' | 'text' = 'card';
}
