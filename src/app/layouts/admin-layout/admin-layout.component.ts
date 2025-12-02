import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {
  isHandset$: Observable<boolean>;
  sidebarOpen = true;
  userMenuOpen = false;
  notificationsOpen = false;
  
  menuItems = [
    {
      title: 'Dashboard',
      icon: 'dashboard',
      route: '/admin/dashboard',
      roles: ['admin', 'manager']
    },
    {
      title: 'Productos',
      icon: 'inventory_2',
      route: '/admin/products',
      roles: ['admin', 'manager'],
      children: [
        { title: 'Todos los productos', route: '/admin/products' },
        { title: 'Libros', route: '/admin/products/books' },
        { title: 'Películas', route: '/admin/products/movies' },
        { title: 'Vinilos', route: '/admin/products/vinyls' },
        { title: 'CDs', route: '/admin/products/cds' }
      ]
    },
    {
      title: 'Inventario',
      icon: 'warehouse',
      route: '/admin/inventory',
      roles: ['admin', 'manager']
    },
    {
      title: 'Ventas',
      icon: 'point_of_sale',
      route: '/admin/sales',
      roles: ['admin', 'manager']
    },
    {
      title: 'Clientes',
      icon: 'people',
      route: '/admin/customers',
      roles: ['admin', 'manager']
    },
    {
      title: 'Reportes',
      icon: 'assessment',
      route: '/admin/reports',
      roles: ['admin', 'manager']
    },
    {
      title: 'Usuarios',
      icon: 'manage_accounts',
      route: '/admin/users',
      roles: ['admin']
    },
    {
      title: 'Roles',
      icon: 'admin_panel_settings',
      route: '/admin/roles',
      roles: ['admin']
    },
    {
      title: 'Configuración',
      icon: 'settings',
      route: '/admin/settings',
      roles: ['admin']
    }
  ];

  notifications = [
    { id: 1, title: 'Stock bajo', message: '5 productos tienen stock bajo', icon: 'warning', time: '5 min ago', read: false },
    { id: 2, title: 'Nueva venta', message: 'Venta #00123 completada', icon: 'shopping_cart', time: '10 min ago', read: false },
    { id: 3, title: 'Usuario nuevo', message: 'Juan Pérez se registró', icon: 'person_add', time: '1 hora ago', read: true }
  ];

  unreadNotifications = this.notifications.filter(n => !n.read).length;

  constructor(
    private breakpointObserver: BreakpointObserver,
    public authService: AuthService,
    private router: Router
  ) {
    this.isHandset$ = this.breakpointObserver.observe([Breakpoints.Handset])
      .pipe(
        map(result => result.matches),
        shareReplay()
      );
  }

  ngOnInit(): void {
    this.isHandset$.subscribe(isHandset => {
      this.sidebarOpen = !isHandset;
    });
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout(): void {
    this.authService.logout();
  }

  hasPermission(roles: string[]): boolean {
    const user = this.authService.getCurrentUser();
    if (!user) return false;
    
    return roles.some(role => 
      user.roles.some(userRole => userRole.name === role)
    );
  }

  navigateToStore(): void {
    this.router.navigate(['/store']);
  }

  markNotificationAsRead(notificationId: number): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.unreadNotifications = this.notifications.filter(n => !n.read).length;
    }
  }

  markAllNotificationsAsRead(): void {
    this.notifications.forEach(n => n.read = true);
    this.unreadNotifications = 0;
  }
}
