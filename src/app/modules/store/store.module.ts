import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreRoutingModule } from './store-routing.module';
import { SharedModule } from '../../shared/shared.module';

// Components
import { CatalogPageComponent } from './pages/catalog-page/catalog-page.component';
import { ProductPageComponent } from './pages/product-page/product-page.component';
import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { CheckoutPageComponent } from './pages/checkout-page/checkout-page.component';
import { OrderConfirmationPageComponent } from './pages/order-confirmation-page/order-confirmation-page.component';
import { ProductCatalogComponent } from './components/product-catalog/product-catalog.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { CartSummaryComponent } from './components/cart-summary/cart-summary.component';
import { CheckoutFormComponent } from './components/checkout-form/checkout-form.component';
import { CategoryFilterComponent } from './components/category-filter/category-filter.component';

@NgModule({
  declarations: [
    CatalogPageComponent,
    ProductPageComponent,
    CartPageComponent,
    CheckoutPageComponent,
    OrderConfirmationPageComponent,
    ProductCatalogComponent,
    ProductDetailComponent,
    CartSummaryComponent,
    CheckoutFormComponent,
    CategoryFilterComponent
  ],
  imports: [
    CommonModule,
    StoreRoutingModule,
    SharedModule
  ],
  exports: [
    ProductCatalogComponent
  ]
})
export class StoreModule { }
