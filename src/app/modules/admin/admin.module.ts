import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

// Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Componentes
import { UsersAdminPageComponent } from './pages/users-admin-page/users-admin-page.component';
import { SalesAdminPageComponent } from './pages/sales-admin-page/sales-admin-page.component';
import { ReportsPageComponent } from './pages/reports-page/reports-page.component';
import { UserTableComponent } from './components/user-table/user-table.component';
import { UserFormComponent } from './components/user-form/user-form.component';

// Shared
import { SharedModule } from '../../shared/shared.module';

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
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    
    // Angular Material
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatCardModule,
    MatDialogModule,
    MatSnackBarModule,
    MatChipsModule,
    MatMenuModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    
    // Shared
    SharedModule
  ],
  exports: [
    UserTableComponent,
    UserFormComponent
  ]
})
export class AdminModule { }
