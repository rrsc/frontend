import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent {
  @Input() placeholder: string = 'Buscar...';
  @Input() debounceTime: number = 300;
  @Input() showButton: boolean = true;
  @Input() buttonText: string = 'Buscar';
  @Input() icon: string = 'search';
  
  @Output() search = new EventEmitter<string>();
  @Output() clear = new EventEmitter<void>();

  searchQuery: string = '';
  private timeoutId: any;

  onSearch(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => {
      this.search.emit(this.searchQuery);
    }, this.debounceTime);
  }

  onClear(): void {
    this.searchQuery = '';
    this.clear.emit();
    this.search.emit('');
  }

  onSubmit(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.search.emit(this.searchQuery);
  }
}
