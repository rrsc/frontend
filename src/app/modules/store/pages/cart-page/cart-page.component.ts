import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { Cart, CartItem } from '../../../core/models/cart.model';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss']
})
export class CartPageComponent implements OnInit {
  cart: Cart | null = null;
  loading = false;

  constructor(
    private cartService: CartService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cart = this.cartService.getCart();
  }

  updateQuantity(item: CartItem, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(item);
      return;
    }

    this.loading = true;
    this.cartService.updateQuantity(item.productId, quantity).subscribe({
      next: (cart) => {
        this.cart = cart;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        console.error('Error updating quantity:', error);
      }
    });
  }

  removeItem(item: CartItem): void {
    this.loading = true;
    this.cartService.removeFromCart(item.productId).subscribe({
      next: (cart) => {
        this.cart = cart;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        console.error('Error removing item:', error);
      }
    });
  }

  clearCart(): void {
    if (!this.cart || this.cart.items.length === 0) return;

    this.loading = true;
    this.cartService.clearCart().subscribe({
      next: () => {
        this.cart = null;
        this.loading = false;
        this.notificationService.showSuccess('Carrito vaciado');
      },
      error: (error) => {
        this.loading = false;
        console.error('Error clearing cart:', error);
      }
    });
  }

  proceedToCheckout(): void {
    if (!this.cart || this.cart.items.length === 0) {
      this.notificationService.showWarning('El carrito está vacío');
      return;
    }

    this.router.navigate(['/store/checkout']);
  }

  continueShopping(): void {
    this.router.navigate(['/store']);
  }

  getItemSubtotal(item: CartItem): number {
    return item.price * item.quantity;
  }

  getCategoryLabel(category: string): string {
    const labels: { [key: string]: string } = {
      'book': 'Libro',
      'movie': 'Película',
      'vinyl': 'Vinilo',
      'compact-disc': 'CD'
    };
    return labels[category] || category;
  }
}
