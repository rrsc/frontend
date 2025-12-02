import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';

// Componentes
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { CartSummaryComponent } from './components/cart-summary/cart-summary.component';
import { CheckoutFormComponent } from './components/checkout-form/checkout-form.component';
import { CategoryFilterComponent } from './components/category-filter/category-filter.component';

// Páginas
import { ProductPageComponent } from './pages/product-page/product-page.component';
import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { CheckoutPageComponent } from './pages/checkout-page/checkout-page.component';

// Servicios
import { OrderService } from './services/order.service';

// Shared
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  {
    path: 'product/:id',
    component: ProductPageComponent
  },
  {
    path: 'cart',
    component: CartPageComponent
  },
  {
    path: 'checkout',
    component: CheckoutPageComponent
  }
];

@NgModule({
  declarations: [
    // Componentes
    ProductDetailComponent,
    CartSummaryComponent,
    CheckoutFormComponent,
    CategoryFilterComponent,
    
    // Páginas
    ProductPageComponent,
    CartPageComponent,
    CheckoutPageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    
    // Angular Material
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSliderModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatBadgeModule,
    MatTooltipModule,
    
    // Shared
    SharedModule
  ],
  exports: [
    ProductDetailComponent,
    CartSummaryComponent,
    CheckoutFormComponent,
    CategoryFilterComponent
  ],
  providers: [
    OrderService
  ]
})
export class StoreModule { }
