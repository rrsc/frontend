import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { BaseProduct, Book, CompactDisc, Movie, Vinyl } from '../../../../core/models/product.model';
import { ApiService } from '../../../../core/services/api.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.scss']
})
export class ProductPageComponent implements OnInit {
  product: BaseProduct | null = null;
  productType: 'book' | 'movie' | 'vinyl' | 'compact-disc' | null = null;
  quantity = 1;
  loading = true;
  relatedProducts: BaseProduct[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private cartService: CartService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = params['id'];
      this.loadProduct(productId);
    });
  }

  loadProduct(id: string): void {
    this.loading = true;
    
    this.apiService.get(`/frontend/products/${id}`).subscribe({
      next: (product) => {
        this.product = product;
        this.productType = product.category;
        this.loadRelatedProducts(product.category, product.id);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.notificationService.showError('Producto no encontrado');
        this.router.navigate(['/store']);
      }
    });
  }

  loadRelatedProducts(category: string, excludeId: string): void {
    this.apiService.get('/frontend/products', {
      category,
      limit: 4,
      exclude: excludeId
    }).subscribe({
      next: (response: any) => {
        this.relatedProducts = response.data || response;
      },
      error: (error) => {
        console.error('Error loading related products:', error);
      }
    });
  }

  incrementQuantity(): void {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (!this.product) return;

    this.cartService.addToCart({
      productId: this.product.id,
      quantity: this.quantity
    }).subscribe({
      next: () => {
        this.notificationService.showSuccess('Producto añadido al carrito');
      },
      error: (error) => {
        this.notificationService.showError('Error al añadir al carrito');
      }
    });
  }

  buyNow(): void {
    this.addToCart();
    this.router.navigate(['/store/cart']);
  }

  isBook(): boolean {
    return this.productType === 'book';
  }

  isMovie(): boolean {
    return this.productType === 'movie';
  }

  isVinyl(): boolean {
    return this.productType === 'vinyl';
  }

  isCompactDisc(): boolean {
    return this.productType === 'compact-disc';
  }

  getProductDetails(): any {
    if (!this.product) return null;
    
    switch (this.productType) {
      case 'book':
        return this.product as Book;
      case 'movie':
        return this.product as Movie;
      case 'vinyl':
        return this.product as Vinyl;
      case 'compact-disc':
        return this.product as CompactDisc;
      default:
        return null;
    }
  }
}
