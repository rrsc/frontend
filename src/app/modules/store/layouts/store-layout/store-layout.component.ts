import { Component, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../../../../core/services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-store-layout',
  templateUrl: './store-layout.component.html',
  styleUrls: ['./store-layout.component.scss']
})
export class StoreLayoutComponent implements OnInit {
  isHandset$: Observable<boolean>;
  cartItemCount = 0;
  categories = [
    { id: 'all', name: 'Todos', icon: 'category' },
    { id: 'book', name: 'Libros', icon: 'menu_book' },
    { id: 'movie', name: 'Películas', icon: 'movie' },
    { id: 'vinyl', name: 'Vinilos', icon: 'album' },
    { id: 'compact-disc', name: 'CDs', icon: 'music_note' }
  ];

  constructor(
    private breakpointObserver: BreakpointObserver,
    private cartService: CartService,
    public authService: AuthService
  ) {
    this.isHandset$ = this.breakpointObserver.observe(['(max-width: 959px)'])
      .pipe(
        map(result => result.matches),
        shareReplay()
      );
  }

  ngOnInit(): void {
    this.cartService.cart$.subscribe(cart => {
      this.cartItemCount = cart?.itemCount || 0;
    });
  }

  searchProducts(query: string): void {
    // Implement search logic
    console.log('Searching for:', query);
  }
}
