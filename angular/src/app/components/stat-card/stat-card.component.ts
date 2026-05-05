import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-lg shadow p-6 border border-gray-100">
      <div class="flex items-start justify-between">
        <div>
          <p class="text-gray-600 text-sm font-medium">{{ title }}</p>
          <p class="text-3xl font-bold text-gray-900 mt-2">{{ value }}</p>
          <p class="text-sm mt-2" [ngClass]="growth >= 0 ? 'text-green-600' : 'text-red-600'">
            <span>{{ growth >= 0 ? '↑' : '↓' }} {{ Math.abs(growth) }}%</span>
            <span class="text-gray-500 ml-1">vs last month</span>
          </p>
        </div>
        <div class="w-12 h-12 rounded-lg" [ngClass]="iconBg" [innerHTML]="icon"></div>
      </div>
    </div>
  `,
  styles: []
})
export class StatCardComponent {
  @Input() title: string = '';
  @Input() value: string = '';
  @Input() growth: number = 0;
  @Input() iconBg: string = 'bg-blue-100';
  @Input() icon: string = '';

  Math = Math;
}
