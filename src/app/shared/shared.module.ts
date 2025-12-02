import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Material Module
import { MaterialModule } from './material.module';

// Charts (ng2-charts)
import { NgChartsModule } from 'ng2-charts';
// Eliminar import de BaseChartDirective si existe

// Pipes
import { CurrencyPipe } from './pipes/currency.pipe';
import { DatePipe } from './pipes/date.pipe';
import { TruncatePipe } from './pipes/truncate.pipe';
import { SafeUrlPipe } from './pipes/safe-url.pipe';

// Components
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';

@NgModule({
  declarations: [
    // Pipes
    CurrencyPipe,
    DatePipe,
    TruncatePipe,
    SafeUrlPipe,
    
    // Components
    LoadingSpinnerComponent,
    ConfirmDialogComponent,
    ProductCardComponent,
    SearchBarComponent,
    PaginatorComponent,
    BreadcrumbComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    
    // Material
    MaterialModule,
    
    // Charts
    NgChartsModule
  ],
  exports: [
    // Modules
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule,
    NgChartsModule,
    
    // Pipes
    CurrencyPipe,
    DatePipe,
    TruncatePipe,
    SafeUrlPipe,
    
    // Components
    LoadingSpinnerComponent,
    ConfirmDialogComponent,
    ProductCardComponent,
    SearchBarComponent,
    PaginatorComponent,
    BreadcrumbComponent
  ]
})
export class SharedModule { }
