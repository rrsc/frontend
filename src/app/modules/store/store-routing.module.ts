import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogPageComponent } from './pages/catalog-page/catalog-page.component';
import { ProductPageComponent } from './pages/product-page/product-page.component';
import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { CheckoutPageComponent } from './pages/checkout-page/checkout-page.component';
import { OrderConfirmationPageComponent } from './pages/order-confirmation-page/order-confirmation-page.component';

const routes: Routes = [
  {
    path: '',
    component: CatalogPageComponent
  },
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
    component: CheckoutPageComponent,
    canActivate: [] // Add auth guard here
  },
  {
    path: 'order-confirmation/:id',
    component: OrderConfirmationPageComponent
  },
  {
    path: 'category/:category',
    component: CatalogPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreRoutingModule { }
