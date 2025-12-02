import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LoadingService } from './core/services/loading.service';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'MediaStore';
  loading = false;

  constructor(
    private loadingService: LoadingService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Suscribirse al estado de carga
    this.loadingService.loading$.subscribe(
      loading => this.loading = loading
    );

    // Escuchar cambios de ruta para scroll al top
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        window.scrollTo(0, 0);
      });

    // Verificar autenticación inicial
    this.authService.isAuthenticated$.subscribe();
  }
}
