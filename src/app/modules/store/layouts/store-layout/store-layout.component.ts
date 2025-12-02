import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-store-layout',
  templateUrl: './store-layout.component.html',
  styleUrls: ['./store-layout.component.scss']
})
export class StoreLayoutComponent implements OnInit {
  cartItemCount: number = 0;
  isLoggedIn: boolean = false;
  user: any = null;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    // Verificar autenticación
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.user = user;
    });

    // Suscribirse a cambios en el carrito
    this.cartService.getCartObservable().subscribe(cart => {
      this.cartItemCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;
    });
  }

  // Navegación
  goToHome() {
    this.router.navigate(['/store']);
  }

  goToCart() {
    this.router.navigate(['/store/cart']);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  goToAdmin() {
    this.router.navigate(['/admin']);
  }

  // Autenticación
  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
