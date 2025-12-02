import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// Shared Module
import { SharedModule } from '../../shared/shared.module';

// Components
import { UsersAdminPageComponent } from './pages/users-admin-page/users-admin-page.component';
import { SalesAdminPageComponent } from './pages/sales-admin-page/sales-admin-page.component';
import { ReportsPageComponent } from './pages/reports-page/reports-page.component';
import { UserTableComponent } from './components/user-table/user-table.component';
import { UserFormComponent } from './components/user-form/user-form.component';

const routes: Routes = [
  {
    path: 'users',
    component: UsersAdminPageComponent,
    data: { title: 'Gestión de Usuarios' }
  },
  {
    path: 'sales',
    component: SalesAdminPageComponent,
    data: { title: 'Gestión de Ventas' }
  },
  {
    path: 'reports',
    component: ReportsPageComponent,
    data: { title: 'Reportes' }
  },
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    UsersAdminPageComponent,
    SalesAdminPageComponent,
    ReportsPageComponent,
    UserTableComponent,
    UserFormComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    
    // Shared Module (incluye MaterialModule)
    SharedModule
  ],
  exports: [
    UserTableComponent,
    UserFormComponent
  ]
})
export class AdminModule { }
