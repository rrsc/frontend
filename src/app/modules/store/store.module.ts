import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// Shared Module (incluye MaterialModule)
import { SharedModule } from '../../shared/shared.module';

// Components
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { CartSummaryComponent } from './components/cart-summary/cart-summary.component';
import { CheckoutFormComponent } from './components/checkout-form/checkout-form.component';
import { CategoryFilterComponent } from './components/category-filter/category-filter.component';

// Layouts
import { StoreLayoutComponent } from './layouts/store-layout/store-layout.component';

// Páginas
import { ProductPageComponent } from './pages/product-page/product-page.component';
import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { CheckoutPageComponent } from './pages/checkout-page/checkout-page.component';
import { StoreHomeComponent } from './pages/store-home/store-home.component';

// Servicios
import { CartService } from './services/cart.service';
import { OrderService } from './services/order.service';

const routes: Routes = [
  {
    path: '',
    component: StoreLayoutComponent,
    children: [
      { path: '', component: StoreHomeComponent },
      { path: 'product/:id', component: ProductPageComponent },
      { path: 'cart', component: CartPageComponent },
      { path: 'checkout', component: CheckoutPageComponent },
      { path: 'category/:slug', component: StoreHomeComponent }
    ]
  }
];

@NgModule({
  declarations: [
    // Layout
    StoreLayoutComponent,
    
    // Components
    ProductDetailComponent,
    CartSummaryComponent,
    CheckoutFormComponent,
    CategoryFilterComponent,
    
    // Páginas
    StoreHomeComponent,
    ProductPageComponent,
    CartPageComponent,
    CheckoutPageComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    
    // Shared Module (incluye MaterialModule y ReactiveFormsModule)
    SharedModule
  ],
  exports: [
    StoreLayoutComponent,
    ProductDetailComponent,
    CartSummaryComponent,
    CheckoutFormComponent,
    CategoryFilterComponent
  ],
  providers: [
    CartService,
    OrderService
  ]
})
export class StoreModule { }
