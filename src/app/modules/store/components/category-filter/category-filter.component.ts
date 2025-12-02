import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
// Eliminar import incorrecto y usar interface local
// import { Category } from '../../../../core/models/category.model';

// Definir interface Category localmente si no existe en core/models
interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  productCount?: number;
}

@Component({
  selector: 'app-category-filter',
  templateUrl: './category-filter.component.html',
  styleUrls: ['./category-filter.component.scss']
})
export class CategoryFilterComponent implements OnInit, OnDestroy {
  @Input() categories: Category[] = [];
  @Input() selectedCategory: string = '';
  @Input() priceRange: { min: number, max: number } = { min: 0, max: 1000 };
  @Input() showAdvancedFilters: boolean = false;
  
  @Output() categoryChange = new EventEmitter<string>();
  @Output() priceChange = new EventEmitter<{ min: number, max: number }>();
  @Output() filterChange = new EventEmitter<any>();
  @Output() clearFilters = new EventEmitter<void>();
  
  filterForm: FormGroup;
  priceMin: number = 0;
  priceMax: number = 1000;
  selectedPriceRange: { min: number, max: number } = { min: 0, max: 1000 };
  
  // Filtros avanzados
  brands: string[] = ['Apple', 'Samsung', 'Sony', 'LG', 'Microsoft', 'Dell', 'HP', 'Lenovo'];
  ratings = [4, 3, 2, 1];
  availabilities = [
    { id: 'in_stock', label: 'En stock', checked: false },
    { id: 'out_of_stock', label: 'Agotado', checked: false },
    { id: 'pre_order', label: 'Pre-orden', checked: false }
  ];
  
  sortOptions = [
    { value: 'price_asc', label: 'Precio: Menor a mayor' },
    { value: 'price_desc', label: 'Precio: Mayor a menor' },
    { value: 'name_asc', label: 'Nombre: A-Z' },
    { value: 'name_desc', label: 'Nombre: Z-A' },
    { value: 'rating_desc', label: 'Mejor valorados' },
    { value: 'newest', label: 'Más recientes' },
    { value: 'bestsellers', label: 'Más vendidos' }
  ];
  
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder) {
    this.filterForm = this.createForm();
  }

  ngOnInit() {
    this.setupFormListeners();
    this.updateFormValues();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Crear formulario
  createForm(): FormGroup {
    return this.fb.group({
      category: [''],
      priceMin: [this.priceMin],
      priceMax: [this.priceMax],
      brands: [[]],
      rating: [0],
      availability: [[]],
      sortBy: ['newest'],
      features: [[]],
      discountOnly: [false],
      freeShipping: [false]
    });
  }

  // Configurar listeners del formulario
  setupFormListeners() {
    // Escuchar cambios en el formulario
    this.filterForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(values => {
        this.emitFilterChange();
      });

    // Escuchar cambios en el rango de precios
    this.filterForm.get('priceMin')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        if (value > this.priceMax) {
          this.filterForm.patchValue({ priceMin: this.priceMax }, { emitEvent: false });
        }
      });

    this.filterForm.get('priceMax')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        if (value < this.priceMin) {
          this.filterForm.patchValue({ priceMax: this.priceMin }, { emitEvent: false });
        }
      });
  }

  // Actualizar valores del formulario
  updateFormValues() {
    this.filterForm.patchValue({
      category: this.selectedCategory,
      priceMin: this.priceRange.min,
      priceMax: this.priceRange.max
    }, { emitEvent: false });
  }

  // Emitir cambio de filtros
  emitFilterChange() {
    const filters = this.filterForm.value;
    this.filterChange.emit(filters);
  }

  // Seleccionar categoría
  selectCategory(categorySlug: string) {
    this.filterForm.patchValue({ category: categorySlug });
    this.categoryChange.emit(categorySlug);
  }

  // Actualizar rango de precios
  updatePriceRange() {
    const min = this.filterForm.get('priceMin')?.value;
    const max = this.filterForm.get('priceMax')?.value;
    this.selectedPriceRange = { min, max };
    this.priceChange.emit(this.selectedPriceRange);
  }

  // Seleccionar marca
  toggleBrand(brand: string) {
    const brands = this.filterForm.get('brands')?.value || [];
    const index = brands.indexOf(brand);
    
    if (index === -1) {
      brands.push(brand);
    } else {
      brands.splice(index, 1);
    }
    
    this.filterForm.patchValue({ brands });
  }

  // Seleccionar disponibilidad
  toggleAvailability(availabilityId: string) {
    const availability = this.filterForm.get('availability')?.value || [];
    const index = availability.indexOf(availabilityId);
    
    if (index === -1) {
      availability.push(availabilityId);
    } else {
      availability.splice(index, 1);
    }
    
    this.filterForm.patchValue({ availability });
  }

  // Seleccionar rating
  selectRating(rating: number) {
    this.filterForm.patchValue({ rating });
  }

  // Limpiar filtros
  clearAllFilters() {
    this.filterForm.patchValue({
      category: '',
      priceMin: this.priceMin,
      priceMax: this.priceMax,
      brands: [],
      rating: 0,
      availability: [],
      sortBy: 'newest',
      features: [],
      discountOnly: false,
      freeShipping: false
    });
    
    this.clearFilters.emit();
  }

  // Verificar si hay filtros activos
  hasActiveFilters(): boolean {
    const values = this.filterForm.value;
    return (
      values.category !== '' ||
      values.priceMin !== this.priceMin ||
      values.priceMax !== this.priceMax ||
      values.brands.length > 0 ||
      values.rating > 0 ||
      values.availability.length > 0 ||
      values.features.length > 0 ||
      values.discountOnly ||
      values.freeShipping
    );
  }

  // Contar filtros activos
  countActiveFilters(): number {
    let count = 0;
    const values = this.filterForm.value;
    
    if (values.category !== '') count++;
    if (values.priceMin !== this.priceMin || values.priceMax !== this.priceMax) count++;
    if (values.brands.length > 0) count++;
    if (values.rating > 0) count++;
    if (values.availability.length > 0) count++;
    if (values.features.length > 0) count++;
    if (values.discountOnly) count++;
    if (values.freeShipping) count++;
    
    return count;
  }

  // Obtener categoría seleccionada
  getSelectedCategoryName(): string {
    if (!this.selectedCategory) return 'Todas las categorías';
    const category = this.categories.find(c => c.slug === this.selectedCategory);
    return category ? category.name : 'Categoría no encontrada';
  }

  // Formatear precio para el slider
  formatPrice(value: number): string {
    return `$${value}`;
  }
}
