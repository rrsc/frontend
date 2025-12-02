import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { ApiService } from '../../core/services/api.service';
import { NotificationService } from '../../core/services/notification.service';
import { Cart, CartItem } from '../../core/models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<Cart | null>(null);
  cart$ = this.cartSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService
  ) {
    this.loadCart();
  }

  private loadCart(): void {
    this.apiService.getCart().subscribe({
      next: (cart) => {
        this.cartSubject.next(cart);
      },
      error: () => {
        this.cartSubject.next(null);
      }
    });
  }

  getCart(): Cart | null {
    return this.cartSubject.value;
  }

  addToCart(item: { productId: string; quantity: number }): Observable<any> {
    return this.apiService.addToCart(item).pipe(
      tap((cart) => {
        this.cartSubject.next(cart);
        this.notificationService.showSuccess('Producto añadido al carrito');
      }),
      catchError((error) => {
        this.notificationService.showError('Error al añadir al carrito');
        throw error;
      })
    );
  }

  updateQuantity(productId: string, quantity: number): Observable<any> {
    if (quantity <= 0) {
      return this.removeFromCart(productId);
    }

    return this.apiService.updateCartItem(productId, quantity).pipe(
      tap((cart) => {
        this.cartSubject.next(cart);
        this.notificationService.showSuccess('Carrito actualizado');
      }),
      catchError((error) => {
        this.notificationService.showError('Error al actualizar carrito');
        throw error;
      })
    );
  }

  removeFromCart(productId: string): Observable<any> {
    return this.apiService.removeFromCart(productId).pipe(
      tap((cart) => {
        this.cartSubject.next(cart);
        this.notificationService.showSuccess('Producto eliminado del carrito');
      }),
      catchError((error) => {
        this.notificationService.showError('Error al eliminar del carrito');
        throw error;
      })
    );
  }

  clearCart(): Observable<any> {
    return this.apiService.clearCart().pipe(
      tap(() => {
        this.cartSubject.next(null);
        this.notificationService.showSuccess('Carrito vaciado');
      }),
      catchError((error) => {
        this.notificationService.showError('Error al vaciar carrito');
        throw error;
      })
    );
  }

  checkout(checkoutData: any): Observable<any> {
    return this.apiService.checkout(checkoutData).pipe(
      tap((sale) => {
        this.cartSubject.next(null);
        this.notificationService.showSuccess('Compra realizada exitosamente');
      }),
      catchError((error) => {
        this.notificationService.showError('Error al procesar la compra');
        throw error;
      })
    );
  }

  getItemCount(): number {
    return this.cartSubject.value?.itemCount || 0;
  }

  getTotal(): number {
    return this.cartSubject.value?.total || 0;
  }
}
