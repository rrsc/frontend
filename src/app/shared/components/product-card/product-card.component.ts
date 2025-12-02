import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BaseProduct, ProductCategory } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input() product!: BaseProduct;
  @Input() showActions = true;
  @Input() quantityInCart = 0;
  @Output() addToCart = new EventEmitter<void>();
  @Output() viewDetails = new EventEmitter<void>();

  get categoryLabel(): string {
    const labels = {
      [ProductCategory.BOOK]: 'Libro',
      [ProductCategory.MOVIE]: 'Película',
      [ProductCategory.VINYL]: 'Vinilo',
      [ProductCategory.COMPACT_DISC]: 'CD'
    };
    return labels[this.product.category] || 'Producto';
  }

  get isLowStock(): boolean {
    return this.product.stock <= 5;
  }

  get isOutOfStock(): boolean {
    return this.product.stock === 0;
  }

  get stockStatus(): string {
    if (this.isOutOfStock) return 'Agotado';
    if (this.isLowStock) return 'Últimas unidades';
    return `Disponible: ${this.product.stock}`;
  }

  onAddToCart(event: Event): void {
    event.stopPropagation();
    this.addToCart.emit();
  }

  onViewDetails(event: Event): void {
    event.stopPropagation();
    this.viewDetails.emit();
  }
}
