import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// Usar interface local
// import { Product } from '../../../../core/models/product.model';

// Definir interface Product localmente
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images?: string[];
  categoryId?: string;
  stock: number;
  sku?: string;
  rating?: number;
  reviewCount?: number;
  isFeatured?: boolean;
  isNew?: boolean;
  discount?: number;
  category?: {
    id: string;
    name: string;
    slug?: string;
  };
  features?: string[];
  specifications?: Record<string, string>;
}

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  @Input() product!: Product;
  @Input() showAddToCart: boolean = true;
  @Output() addedToCart = new EventEmitter<Product>();
  
  quantityForm: FormGroup;
  selectedImage: string = '';
  quantity: number = 1;
  maxQuantity: number = 10;
  isLoading: boolean = false;
  
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private cartService: any, // Usar any temporalmente
    private snackBar: MatSnackBar
  ) {
    this.quantityForm = this.fb.group({
      quantity: [1, [Validators.required, Validators.min(1), Validators.max(this.maxQuantity)]]
    });
  }

  ngOnInit() {
    if (this.product) {
      this.selectedImage = this.product.images?.[0] || 'assets/images/default-product.png';
      this.maxQuantity = Math.min(this.product.stock || 10, 10);
      
      // Actualizar validadores basados en stock
      this.quantityForm.get('quantity')?.setValidators([
        Validators.required,
        Validators.min(1),
        Validators.max(this.maxQuantity)
      ]);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Seleccionar imagen
  selectImage(image: string) {
    this.selectedImage = image;
  }

  // Cambiar cantidad
  changeQuantity(change: number) {
    const currentValue = this.quantityForm.get('quantity')?.value || 1;
    const newValue = currentValue + change;
    
    if (newValue >= 1 && newValue <= this.maxQuantity) {
      this.quantityForm.patchValue({ quantity: newValue });
    }
  }

  // Agregar al carrito
  addToCart() {
    if (this.quantityForm.invalid || this.isLoading) {
      return;
    }

    this.isLoading = true;
    const quantity = this.quantityForm.get('quantity')?.value;
    
    // Simular llamada API
    setTimeout(() => {
      this.isLoading = false;
      this.addedToCart.emit(this.product);
      
      this.snackBar.open(
        `${quantity} ${quantity === 1 ? 'unidad' : 'unidades'} de "${this.product.name}" agregada(s) al carrito`,
        'Cerrar',
        {
          duration: 3000,
          panelClass: ['success-snackbar']
        }
      );
    }, 1000);
  }

  // Comprar ahora
  buyNow() {
    this.addToCart();
    // En una implementación real, aquí redirigiríamos al checkout
  }

  // Calcular precio con descuento
  getDiscountedPrice(): number {
    if (this.product.discount && this.product.discount > 0) {
      return this.product.price * (1 - this.product.discount / 100);
    }
    return this.product.price;
  }

  // Verificar si hay descuento
  hasDiscount(): boolean {
    return !!(this.product.discount && this.product.discount > 0);
  }

  // Obtener ahorro en descuento
  getSavings(): number {
    return this.product.price - this.getDiscountedPrice();
  }

  // Verificar stock disponible
  isOutOfStock(): boolean {
    return this.product.stock <= 0;
  }

  // Verificar stock bajo
  isLowStock(): boolean {
    return this.product.stock > 0 && this.product.stock <= 5;
  }
}
