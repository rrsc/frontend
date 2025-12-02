import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Cart, CartItem } from '../../../../core/models/cart.model';
import { CartService } from '../../services/cart.service';

// Definir interface para producto en el carrito
interface CartProduct {
  id: string;
  name: string;
  price: number;
  images?: string[];
  sku?: string;
  discount?: number;
}

@Component({
  selector: 'app-cart-summary',
  templateUrl: './cart-summary.component.html',
  styleUrls: ['./cart-summary.component.scss']
})
export class CartSummaryComponent implements OnInit, OnDestroy {
  @Input() cart: Cart | null = null;
  @Input() showCheckoutButton: boolean = true;
  @Input() showContinueShopping: boolean = true;
  @Output() updateCart = new EventEmitter<void>();
  @Output() proceedToCheckout = new EventEmitter<void>();
  
  isLoading: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    // Si no se pasa un carrito, cargar el del usuario
    if (!this.cart) {
      this.loadCart();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Cargar carrito
  loadCart() {
    this.isLoading = true;
    const cart = this.cartService.getCart();
    
    if (cart) {
      this.cart = cart;
    } else {
      // Crear carrito vacío si no existe
      this.cart = {
        id: '',
        userId: '',
        items: [],
        total: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }
    
    this.isLoading = false;
  }

  // Calcular subtotal
  getSubtotal(): number {
    if (!this.cart?.items) return 0;
    return this.cart.items.reduce((total: number, item: CartItem) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  // Calcular descuentos (simulado)
  getDiscount(): number {
    if (!this.cart?.items) return 0;
    // Simular descuento basado en lógica de negocio
    return this.cart.items.reduce((total: number, item: CartItem) => {
      // Aquí deberías obtener el producto real para ver su descuento
      // Por ahora simulamos un 10% de descuento si el precio > 100
      if (item.price > 100) {
        return total + (item.price * 0.1 * item.quantity);
      }
      return total;
    }, 0);
  }

  // Calcular total
  getTotal(): number {
    return this.getSubtotal() - this.getDiscount();
  }

  // Calcular IVA (asumiendo 16%)
  getTax(): number {
    return this.getTotal() * 0.16;
  }

  // Calcular total con IVA
  getTotalWithTax(): number {
    return this.getTotal() + this.getTax();
  }

  // Verificar si hay descuento
  hasDiscount(): boolean {
    return this.getDiscount() > 0;
  }

  // Verificar si el carrito está vacío
  isEmpty(): boolean {
    return !this.cart?.items || this.cart.items.length === 0;
  }

  // Proceder al checkout
  onProceedToCheckout() {
    if (this.isEmpty()) return;
    
    if (this.proceedToCheckout.observers.length > 0) {
      this.proceedToCheckout.emit();
    } else {
      this.router.navigate(['/store/checkout']);
    }
  }

  // Continuar comprando
  onContinueShopping() {
    this.router.navigate(['/store']);
  }

  // Actualizar carrito
  onUpdateCart() {
    this.updateCart.emit();
  }

  // Eliminar item del carrito
  removeItem(itemId: string) {
    this.isLoading = true;
    this.cartService.removeFromCart(itemId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadCart();
          this.onUpdateCart();
        },
        error: (error: any) => {
          console.error('Error removing item:', error);
          this.isLoading = false;
        }
      });
  }

  // Actualizar cantidad
  updateQuantity(itemId: string, quantity: number) {
    if (quantity < 1) {
      this.removeItem(itemId);
      return;
    }

    this.isLoading = true;
    this.cartService.updateCartItem(itemId, quantity)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadCart();
          this.onUpdateCart();
        },
        error: (error: any) => {
          console.error('Error updating quantity:', error);
          this.isLoading = false;
        }
      });
  }

  // Vaciar carrito
  clearCart() {
    if (confirm('¿Estás seguro de vaciar el carrito?')) {
      this.isLoading = true;
      this.cartService.clearCart()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadCart();
            this.onUpdateCart();
          },
          error: (error: any) => {
            console.error('Error clearing cart:', error);
            this.isLoading = false;
          }
        });
    }
  }

  // Obtener imagen del producto (simulado)
  getProductImage(item: CartItem): string {
    // En una implementación real, esto vendría del producto asociado
    return 'assets/images/default-product.png';
  }

  // Obtener nombre del producto (simulado)
  getProductName(item: CartItem): string {
    // En una implementación real, esto vendría del producto asociado
    return `Producto ${item.productId.substring(0, 8)}`;
  }

  // Obtener SKU del producto (simulado)
  getProductSKU(item: CartItem): string {
    return `SKU-${item.productId.substring(0, 8)}`;
  }

  // Obtener descuento del producto (simulado)
  getProductDiscount(item: CartItem): number {
    // Simular descuento basado en lógica
    return item.price > 100 ? 10 : 0;
  }
}
