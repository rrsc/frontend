import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';

// Definir interfaces locales si es necesario
interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  delivery: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
}

@Component({
  selector: 'app-checkout-form',
  templateUrl: './checkout-form.component.html',
  styleUrls: ['./checkout-form.component.scss']
})
export class CheckoutFormComponent implements OnInit, OnDestroy {
  @Output() orderPlaced = new EventEmitter<any>();
  
  checkoutForm: FormGroup;
  paymentMethods: PaymentMethod[] = [
    { id: 'credit_card', name: 'Tarjeta de crédito', icon: 'credit_card' },
    { id: 'debit_card', name: 'Tarjeta de débito', icon: 'account_balance' },
    { id: 'paypal', name: 'PayPal', icon: 'payments' },
    { id: 'cash', name: 'Pago en efectivo', icon: 'attach_money' }
  ];
  
  shippingMethods: ShippingMethod[] = [
    { id: 'standard', name: 'Estándar (5-7 días)', price: 5.99, delivery: '5-7 días hábiles' },
    { id: 'express', name: 'Express (2-3 días)', price: 12.99, delivery: '2-3 días hábiles' },
    { id: 'overnight', name: 'Entrega nocturna', price: 24.99, delivery: '24 horas' }
  ];
  
  isLoading: boolean = false;
  isSubmitting: boolean = false;
  cart: any;
  selectedShippingMethod = this.shippingMethods[0];
  
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.checkoutForm = this.createForm();
  }

  ngOnInit() {
    this.loadCart();
    this.setupFormListeners();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Crear formulario
  createForm(): FormGroup {
    return this.fb.group({
      // Información de contacto
      contact: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s-]{10,}$/)]],
        newsletter: [true]
      }),
      
      // Información de envío
      shipping: this.fb.group({
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        address: ['', Validators.required],
        apartment: [''],
        city: ['', Validators.required],
        state: ['', Validators.required],
        postalCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
        country: ['', Validators.required],
        shippingMethod: [this.shippingMethods[0].id, Validators.required]
      }),
      
      // Información de facturación
      billing: this.fb.group({
        sameAsShipping: [true],
        firstName: [''],
        lastName: [''],
        address: [''],
        city: [''],
        state: [''],
        postalCode: [''],
        country: ['']
      }),
      
      // Información de pago
      payment: this.fb.group({
        method: ['credit_card', Validators.required],
        cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
        cardHolder: ['', Validators.required],
        expiryMonth: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])$/)]],
        expiryYear: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
        cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
        saveCard: [false]
      }),
      
      // Términos y condiciones
      terms: [false, Validators.requiredTrue]
    });
  }

  // Configurar listeners del formulario
  setupFormListeners() {
    // Copiar dirección de envío a facturación
    this.checkoutForm.get('billing.sameAsShipping')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(sameAsShipping => {
        if (sameAsShipping) {
          this.copyShippingToBilling();
        }
      });
    
    // Actualizar dirección de facturación cuando cambia la de envío
    const shippingGroup = this.checkoutForm.get('shipping');
    if (shippingGroup) {
      shippingGroup.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          if (this.checkoutForm.get('billing.sameAsShipping')?.value) {
            this.copyShippingToBilling();
          }
        });
    }
  }

  // Copiar dirección de envío a facturación
  copyShippingToBilling() {
    const shipping = this.checkoutForm.get('shipping')?.value;
    const billing = this.checkoutForm.get('billing');
    
    billing?.patchValue({
      firstName: shipping?.firstName || '',
      lastName: shipping?.lastName || '',
      address: shipping?.address || '',
      city: shipping?.city || '',
      state: shipping?.state || '',
      postalCode: shipping?.postalCode || '',
      country: shipping?.country || ''
    });
  }

  // Cargar carrito
  loadCart() {
    this.isLoading = true;
    const cart = this.cartService.getCart();
    
    if (cart) {
      this.cart = cart;
      this.isLoading = false;
    } else {
      // Si no hay carrito, crear uno vacío
      this.cart = { items: [] };
      this.isLoading = false;
    }
  }

  // Obtener método de envío seleccionado
  getSelectedShippingMethod() {
    const methodId = this.checkoutForm.get('shipping.shippingMethod')?.value;
    return this.shippingMethods.find(method => method.id === methodId) || this.shippingMethods[0];
  }

  // Calcular subtotal
  getSubtotal(): number {
    if (!this.cart?.items) return 0;
    return this.cart.items.reduce((total: number, item: any) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  // Calcular total
  getTotal(): number {
    const subtotal = this.getSubtotal();
    const shipping = this.getSelectedShippingMethod().price;
    const tax = subtotal * 0.16; // 16% IVA
    return subtotal + shipping + tax;
  }

  // Enviar orden
  onSubmit() {
    if (this.checkoutForm.invalid || this.isSubmitting) {
      this.markFormGroupTouched(this.checkoutForm);
      return;
    }

    this.isSubmitting = true;
    
    const orderData = {
      ...this.checkoutForm.value,
      cartId: this.cart?.id,
      total: this.getTotal(),
      items: this.cart?.items.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
      }))
    };

    this.orderService.createOrder(orderData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (order) => {
          this.isSubmitting = false;
          this.orderPlaced.emit(order);
          
          this.snackBar.open('¡Orden creada exitosamente!', 'Cerrar', {
            duration: 5000,
            panelClass: ['success-snackbar']
          });
          
          // Redirigir a confirmación
          this.router.navigate(['/store/order-confirmation', order.id]);
        },
        error: (error: any) => {
          this.isSubmitting = false;
          console.error('Error creating order:', error);
          
          this.snackBar.open('Error al crear la orden. Por favor, intente nuevamente.', 'Cerrar', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }

  // Marcar todos los campos como tocados
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Navegar atrás
  goBack() {
    this.router.navigate(['/store/cart']);
  }

  // Getters para validación
  get contactGroup() { return this.checkoutForm.get('contact'); }
  get shippingGroup() { return this.checkoutForm.get('shipping'); }
  get billingGroup() { return this.checkoutForm.get('billing'); }
  get paymentGroup() { return this.checkoutForm.get('payment'); }
  get terms() { return this.checkoutForm.get('terms'); }
}
