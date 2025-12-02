import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../../../../core/services/api.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { BaseProduct, ProductCategory } from '../../../../core/models/product.model';
import { ProductFormComponent } from '../../components/product-form/product-form.component';

@Component({
  selector: 'app-products-admin-page',
  templateUrl: './products-admin-page.component.html',
  styleUrls: ['./products-admin-page.component.scss']
})
export class ProductsAdminPageComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  products: BaseProduct[] = [];
  dataSource = new MatTableDataSource<BaseProduct>();
  loading = false;
  searchQuery = '';
  selectedCategory = 'all';

  displayedColumns: string[] = [
    'image', 
    'name', 
    'sku', 
    'category', 
    'price', 
    'stock', 
    'status', 
    'actions'
  ];

  categories = [
    { value: 'all', label: 'Todos' },
    { value: 'book', label: 'Libros' },
    { value: 'movie', label: 'Películas' },
    { value: 'vinyl', label: 'Vinilos' },
    { value: 'compact-disc', label: 'CDs' }
  ];

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    
    const params: any = {};
    if (this.selectedCategory !== 'all') {
      params.category = this.selectedCategory;
    }
    if (this.searchQuery) {
      params.search = this.searchQuery;
    }

    this.apiService.getProducts(params).subscribe({
      next: (response: any) => {
        this.products = response.data || response;
        this.dataSource.data = this.products;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.notificationService.showError('Error al cargar productos');
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    this.loadProducts();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = 'all';
    this.loadProducts();
  }

  openAddProductDialog(): void {
    const dialogRef = this.dialog.open(ProductFormComponent, {
      width: '800px',
      maxWidth: '90vw',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProducts();
        this.notificationService.showSuccess('Producto creado exitosamente');
      }
    });
  }

  openEditProductDialog(product: BaseProduct): void {
    const dialogRef = this.dialog.open(ProductFormComponent, {
      width: '800px',
      maxWidth: '90vw',
      data: { 
        mode: 'edit',
        product: product 
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProducts();
        this.notificationService.showSuccess('Producto actualizado exitosamente');
      }
    });
  }

  openDeleteConfirmDialog(product: BaseProduct): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Producto',
        message: `¿Estás seguro de que deseas eliminar el producto "${product.name}"? Esta acción no se puede deshacer.`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        type: 'warning'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteProduct(product.id);
      }
    });
  }

  deleteProduct(productId: string): void {
    this.apiService.deleteProduct(productId).subscribe({
      next: () => {
        this.notificationService.showSuccess('Producto eliminado exitosamente');
        this.loadProducts();
      },
      error: (error) => {
        console.error('Error deleting product:', error);
        this.notificationService.showError('Error al eliminar producto');
      }
    });
  }

  updateProductStatus(product: BaseProduct, isActive: boolean): void {
    const updatedProduct = { ...product, isActive };
    
    this.apiService.updateProduct(product.id, updatedProduct).subscribe({
      next: () => {
        const message = isActive 
          ? 'Producto activado exitosamente' 
          : 'Producto desactivado exitosamente';
        this.notificationService.showSuccess(message);
        this.loadProducts();
      },
      error: (error) => {
        console.error('Error updating product status:', error);
        this.notificationService.showError('Error al actualizar estado del producto');
      }
    });
  }

  updateStock(product: BaseProduct): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Actualizar Stock',
        message: `Ingresa la nueva cantidad de stock para "${product.name}":`,
        type: 'info',
        showInput: true,
        inputLabel: 'Cantidad',
        inputType: 'number',
        inputValue: product.stock.toString(),
        confirmText: 'Actualizar',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result !== false) {
        const newStock = parseInt(result, 10);
        if (!isNaN(newStock) && newStock >= 0) {
          this.apiService.updateStock(product.id, { quantity: newStock }).subscribe({
            next: () => {
              this.notificationService.showSuccess('Stock actualizado exitosamente');
              this.loadProducts();
            },
            error: (error) => {
              console.error('Error updating stock:', error);
              this.notificationService.showError('Error al actualizar stock');
            }
          });
        }
      }
    });
  }

  getCategoryLabel(category: ProductCategory): string {
    const cat = this.categories.find(c => c.value === category);
    return cat?.label || category;
  }

  getCategoryClass(category: ProductCategory): string {
    return `category-badge ${category}`;
  }

  getStockStatus(stock: number): { label: string, class: string } {
    if (stock === 0) {
      return { label: 'Agotado', class: 'out-of-stock' };
    } else if (stock <= 5) {
      return { label: 'Bajo Stock', class: 'low-stock' };
    } else {
      return { label: 'Disponible', class: 'in-stock' };
    }
  }

  exportProducts(): void {
    this.loading = true;
    this.apiService.get('/reports/products/export', { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `productos-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error exporting products:', error);
        this.notificationService.showError('Error al exportar productos');
        this.loading = false;
      }
    });
  }
}
