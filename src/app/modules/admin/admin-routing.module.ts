import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { RoleGuard } from '../../core/guards/role.guard';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { ProductsAdminPageComponent } from './pages/products-admin-page/products-admin-page.component';
import { UsersAdminPageComponent } from './pages/users-admin-page/users-admin-page.component';
import { SalesAdminPageComponent } from './pages/sales-admin-page/sales-admin-page.component';
import { ReportsPageComponent } from './pages/reports-page/reports-page.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardPageComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'manager'] }
  },
  {
    path: 'dashboard',
    component: DashboardPageComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'manager'] }
  },
  {
    path: 'products',
    component: ProductsAdminPageComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'manager'] }
  },
  {
    path: 'users',
    component: UsersAdminPageComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'sales',
    component: SalesAdminPageComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'manager'] }
  },
  {
    path: 'reports',
    component: ReportsPageComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'manager'] }
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
