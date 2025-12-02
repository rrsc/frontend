import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Cart, CartItem } from '../../../core/models/cart.model';
import { Product } from '../../../core/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<Cart | null>(null);
  cart$ = this.cartSubject.asObservable();

  constructor() {
    // Cargar carrito desde localStorage
    this.loadCartFromStorage();
  }

  // Obtener carrito actual
  getCart(): Cart | null {
    return this.cartSubject.value;
  }

  // Obtener carrito como observable
  getCartObservable(): Observable<Cart | null> {
    return this.cart$;
  }

  // Agregar producto al carrito
  addToCart(productId: string, quantity: number = 1): Observable<Cart> {
    const currentCart = this.getCart() || this.createNewCart();
    
    // Buscar si el producto ya está en el carrito
    const existingItem = currentCart.items.find(item => item.productId === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      const newItem: CartItem = {
        id: this.generateId(),
        cartId: currentCart.id,
        productId: productId,
        quantity: quantity,
        price: 0, // Este precio debería venir del producto
        createdAt: new Date(),
        updatedAt: new Date()
      };
      currentCart.items.push(newItem);
    }
    
    this.updateCart(currentCart);
    return of(currentCart);
  }

  // Actualizar cantidad de un item
  updateCartItem(itemId: string, quantity: number): Observable<Cart> {
    const currentCart = this.getCart();
    if (!currentCart) {
      throw new Error('No hay carrito');
    }
    
    const item = currentCart.items.find(item => item.id === itemId);
    if (item) {
      if (quantity <= 0) {
        return this.removeFromCart(itemId);
      }
      item.quantity = quantity;
      item.updatedAt = new Date();
      this.updateCart(currentCart);
    }
    
    return of(currentCart);
  }

  // Eliminar item del carrito
  removeFromCart(itemId: string): Observable<Cart> {
    const currentCart = this.getCart();
    if (!currentCart) {
      throw new Error('No hay carrito');
    }
    
    currentCart.items = currentCart.items.filter(item => item.id !== itemId);
    this.updateCart(currentCart);
    return of(currentCart);
  }

  // Vaciar carrito
  clearCart(): Observable<Cart> {
    const currentCart = this.getCart();
    if (!currentCart) {
      throw new Error('No hay carrito');
    }
    
    currentCart.items = [];
    this.updateCart(currentCart);
    return of(currentCart);
  }

  // Calcular total del carrito
  calculateTotal(cart: Cart): number {
    return cart.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  // Métodos privados
  private createNewCart(): Cart {
    return {
      id: this.generateId(),
      userId: 'current-user-id', // En una app real, esto vendría del auth
      items: [],
      total: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  private updateCart(cart: Cart): void {
    cart.total = this.calculateTotal(cart);
    cart.updatedAt = new Date();
    this.cartSubject.next(cart);
    this.saveCartToStorage(cart);
  }

  private loadCartFromStorage(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const cart = JSON.parse(savedCart);
        // Convertir strings de fecha a objetos Date
        cart.createdAt = new Date(cart.createdAt);
        cart.updatedAt = new Date(cart.updatedAt);
        cart.items = cart.items.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt)
        }));
        this.cartSubject.next(cart);
      } catch (error) {
        console.error('Error loading cart from storage:', error);
        localStorage.removeItem('cart');
      }
    }
  }

  private saveCartToStorage(cart: Cart): void {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
