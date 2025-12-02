import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { BaseProduct, ProductCategory } from '../../../../core/models/product.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-catalog',
  templateUrl: './product-catalog.component.html',
  styleUrls: ['./product-catalog.component.scss']
})
export class ProductCatalogComponent implements OnInit {
  @Input() products: BaseProduct[] = [];
  @Input() totalProducts = 0;
  @Input() pageSize = 12;
  @Input() currentPage = 0;
  @Input() showFilters = true;
  @Input() title = 'Catálogo de Productos';
  
  @Output() pageChanged = new EventEmitter<PageEvent>(); // <- PageEvent
  @Output() categoryFilter = new EventEmitter<string>(); // <- string
  @Output() search = new EventEmitter<string>(); // <- string

  categories = [
    { value: 'all', label: 'Todos los productos' },
    { value: 'book', label: 'Libros' },
    { value: 'movie', label: 'Películas' },
    { value: 'vinyl', label: 'Vinilos' },
    { value: 'compact-disc', label: 'CDs' }
  ];

  selectedCategory = 'all';
  searchQuery = '';
  sortOptions = [
    { value: 'name_asc', label: 'Nombre A-Z' },
    { value: 'name_desc', label: 'Nombre Z-A' },
    { value: 'price_asc', label: 'Precio más bajo' },
    { value: 'price_desc', label: 'Precio más alto' },
    { value: 'newest', label: 'Más recientes' }
  ];
  selectedSort = 'name_asc';

  constructor(private cartService: CartService) {}

  ngOnInit(): void {}

  onPageChange(event: PageEvent): void {
    this.pageChanged.emit(event);
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.categoryFilter.emit(category);
  }

  onSearch(): void {
    this.search.emit(this.searchQuery);
  }

  onSortChange(sort: string): void {
    this.selectedSort = sort;
    // Emit sort event or handle locally
  }

  getProductQuantityInCart(productId: string): number {
    const cart = this.cartService.getCart();
    const item = cart?.items.find(i => i.productId === productId);
    return item?.quantity || 0;
  }

  onAddToCart(product: BaseProduct): void {
    this.cartService.addToCart({
      productId: product.id,
      quantity: 1
    }).subscribe({
      next: () => {
        console.log('Producto añadido al carrito');
      },
      error: (error) => {
        console.error('Error añadiendo al carrito:', error);
      }
    });
  }

  getCategoryLabel(category: ProductCategory): string {
    const cat = this.categories.find(c => c.value === category);
    return cat?.label || category;
  }
}
