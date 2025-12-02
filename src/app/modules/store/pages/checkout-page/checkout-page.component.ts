import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // <- Importar CommonModule
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

// Angular Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { CartService } from '../../services/cart.service';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { PaymentMethod } from '../../../../core/models/cart.model';
import { StoreLayoutComponent } from '../../layouts/store-layout/store-layout.component';

@Component({
  selector: 'app-checkout-page',
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.scss'],
  standalone: true, // <- Si es standalone
  imports: [
    CommonModule, // <- ¡IMPORTANTE! Para CurrencyPipe
    ReactiveFormsModule,
    RouterModule,
    
    // Angular Material
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    
    StoreLayoutComponent
  ]
})
export class CheckoutPageComponent implements OnInit {
  checkoutForm: FormGroup;
  cart: any = null;
  loading = false;
  paymentMethods = [
    { value: PaymentMethod.CARD, label: 'Tarjeta de crédito/débito', icon: 'credit_card' },
    { value: PaymentMethod.CASH, label: 'Efectivo', icon: 'payments' },
    { value: PaymentMethod.TRANSFER, label: 'Transferencia bancaria', icon: 'account_balance' }
  ];

  shippingMethods = [
    { value: 'standard', label: 'Envío estándar (5-7 días)', price: 0, freeAbove: 50 },
    { value: 'express', label: 'Envío express (2-3 días)', price: 9.99, freeAbove: 100 },
    { value: 'pickup', label: 'Recoger en tienda', price: 0 }
  ];

  selectedShipping = 'standard';

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.checkoutForm = this.createCheckoutForm();
  }

  ngOnInit(): void {
    this.loadCart();
    this.prefillUserData();
  }

  createCheckoutForm(): FormGroup {
    return this.fb.group({
      shippingAddress: this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', Validators.required],
        address: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zipCode: ['', Validators.required],
        country: ['México', Validators.required]
      }),
      billingAddress: this.fb.group({
        sameAsShipping: [true],
        firstName: [''],
        lastName: [''],
        address: [''],
        city: [''],
        state: [''],
        zipCode: [''],
        country: ['']
      }),
      paymentMethod: [PaymentMethod.CARD, Validators.required],
      cardDetails: this.fb.group({
        cardNumber: ['', Validators.required],
        cardHolder: ['', Validators.required],
        expiryMonth: ['', Validators.required],
        expiryYear: ['', Validators.required],
        cvv: ['', Validators.required]
      }),
      notes: [''],
      termsAccepted: [false, Validators.requiredTrue]
    });
  }

  loadCart(): void {
    this.cart = this.cartService.getCart();
    if (!this.cart || this.cart.items.length === 0) {
      this.notificationService.showWarning('El carrito está vacío');
      this.router.navigate(['/store/cart']);
    }
  }

  prefillUserData(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.checkoutForm.patchValue({
        shippingAddress: {
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || ''
        }
      });
    }
  }

  get shippingCost(): number {
    const method = this.shippingMethods.find(m => m.value === this.selectedShipping);
    if (!method) return 0;
    
    if (method.freeAbove && this.cart?.subtotal >= method.freeAbove) {
      return 0;
    }
    return method.price;
  }

  get total(): number {
    if (!this.cart) return 0;
    const tax = this.cart.total - this.cart.subtotal;
    return this.cart.subtotal + tax + this.shippingCost;
  }

  onSubmit(): void {
    if (this.checkoutForm.invalid) {
      this.markFormGroupTouched(this.checkoutForm);
      this.notificationService.showError('Por favor completa todos los campos requeridos');
      return;
    }

    if (!this.cart || this.cart.items.length === 0) {
      this.notificationService.showError('El carrito está vacío');
      return;
    }

    this.loading = true;

    const checkoutData = {
      ...this.checkoutForm.value,
      shippingMethod: this.selectedShipping,
      shippingCost: this.shippingCost,
      cartId: this.cart.id
    };

    // Remove card details if not paying with card
    if (checkoutData.paymentMethod !== PaymentMethod.CARD) {
      delete checkoutData.cardDetails;
    }

    // Remove billing address if same as shipping
    if (checkoutData.billingAddress.sameAsShipping) {
      checkoutData.billingAddress = checkoutData.shippingAddress;
    }

    this.cartService.checkout(checkoutData).subscribe({
      next: (sale) => {
        this.loading = false;
        this.router.navigate(['/store/order-confirmation', sale.id]);
      },
      error: (error) => {
        this.loading = false;
        console.error('Checkout error:', error);
        this.notificationService.showError('Error al procesar el pedido');
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/store/cart']);
  }

  getPaymentIcon(method: PaymentMethod): string {
    const payment = this.paymentMethods.find(p => p.value === method);
    return payment?.icon || 'credit_card';
  }
}
