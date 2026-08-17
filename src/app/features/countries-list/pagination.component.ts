import { CommonModule } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';

type PaginationItem = number | 'ellipsis';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent {
  readonly currentPage = input(1);
  readonly totalPages = input(1);
  readonly pageChange = output<number>();

  readonly pages = computed<PaginationItem[]>(() => {
    const totalPages = this.totalPages();
    const currentPage = this.currentPage();

    if (totalPages <= 10) {
      return this.createRange(1, totalPages);
    }

    if (currentPage <= 5) {
      return [
        ...this.createRange(1, 8),
        'ellipsis',
        totalPages - 1,
        totalPages,
      ];
    }

    if (currentPage >= totalPages - 4) {
      return [
        1,
        2,
        'ellipsis',
        ...this.createRange(totalPages - 7, totalPages),
      ];
    }

    return [
      1,
      2,
      'ellipsis',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      'ellipsis',
      totalPages - 1,
      totalPages,
    ];
  });

  readonly isPreviousDisabled = computed(() => this.currentPage() <= 1);
  readonly isNextDisabled = computed(
    () => this.currentPage() >= this.totalPages(),
  );

  goToPage(page: number): void {
    const clampedPage = Math.min(Math.max(page, 1), this.totalPages());

    if (clampedPage !== this.currentPage()) {
      this.pageChange.emit(clampedPage);
    }
  }

  goToPreviousPage(): void {
    this.goToPage(this.currentPage() - 1);
  }

  goToNextPage(): void {
    this.goToPage(this.currentPage() + 1);
  }

  private createRange(start: number, end: number): number[] {
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }
}
