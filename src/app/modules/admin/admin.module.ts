import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../../shared/shared.module';

// Components
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { ProductsAdminPageComponent } from './pages/products-admin-page/products-admin-page.component';
import { UsersAdminPageComponent } from './pages/users-admin-page/users-admin-page.component';
import { SalesAdminPageComponent } from './pages/sales-admin-page/sales-admin-page.component';
import { ReportsPageComponent } from './pages/reports-page/reports-page.component';

// Dashboard Components
import { MetricsCardsComponent } from './components/metrics-cards/metrics-cards.component';
import { SalesChartComponent } from './components/sales-chart/sales-chart.component';
import { InventoryChartComponent } from './components/inventory-chart/inventory-chart.component';
import { TopProductsTableComponent } from './components/top-products-table/top-products-table.component';
import { RecentSalesTableComponent } from './components/recent-sales-table/recent-sales-table.component';

// Admin Components
import { ProductFormComponent } from './components/product-form/product-form.component';
import { ProductTableComponent } from './components/product-table/product-table.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { UserTableComponent } from './components/user-table/user-table.component';
import { RoleManagementComponent } from './components/role-management/role-management.component';

@NgModule({
  declarations: [
    // Pages
    DashboardPageComponent,
    ProductsAdminPageComponent,
    UsersAdminPageComponent,
    SalesAdminPageComponent,
    ReportsPageComponent,
    
    // Dashboard Components
    MetricsCardsComponent,
    SalesChartComponent,
    InventoryChartComponent,
    TopProductsTableComponent,
    RecentSalesTableComponent,
    
    // Admin Components
    ProductFormComponent,
    ProductTableComponent,
    UserFormComponent,
    UserTableComponent,
    RoleManagementComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ]
})
export class AdminModule { }
