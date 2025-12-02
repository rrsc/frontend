import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnChanges {
  @Input() totalItems: number = 0;
  @Input() pageSize: number = 10;
  @Input() pageSizeOptions: number[] = [5, 10, 25, 50];
  @Input() currentPage: number = 0;
  @Input() showFirstLastButtons: boolean = true;
  @Input() hidePageSize: boolean = false;
  @Input() disabled: boolean = false;
  
  @Output() pageChanged = new EventEmitter<PageEvent>();

  pageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 10,
    length: 0
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['totalItems'] || changes['pageSize'] || changes['currentPage']) {
      this.pageEvent = {
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        length: this.totalItems
      };
    }
  }

  onPageChange(event: PageEvent): void {
    this.pageEvent = event;
    this.pageChanged.emit(event);
  }

  getDisplayedRange(): string {
    const start = this.currentPage * this.pageSize + 1;
    const end = Math.min((this.currentPage + 1) * this.pageSize, this.totalItems);
    return `${start} - ${end} de ${this.totalItems}`;
  }

  getTotalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  goToFirstPage(): void {
    if (this.currentPage !== 0) {
      const event: PageEvent = {
        pageIndex: 0,
        pageSize: this.pageSize,
        length: this.totalItems
      };
      this.pageChanged.emit(event);
    }
  }

  goToLastPage(): void {
    const lastPage = this.getTotalPages() - 1;
    if (this.currentPage !== lastPage) {
      const event: PageEvent = {
        pageIndex: lastPage,
        pageSize: this.pageSize,
        length: this.totalItems
      };
      this.pageChanged.emit(event);
    }
  }
}
