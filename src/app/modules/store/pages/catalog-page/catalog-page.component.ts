import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ApiService } from '../../../../core/services/api.service';
import { BaseProduct, ProductCategory } from '../../../../core/models/product.model';
import { StoreLayoutComponent } from '../../layouts/store-layout/store-layout.component';
import { ProductCatalogComponent } from '../../components/product-catalog/product-catalog.component'; // <- IMPORTAR

@Component({
  selector: 'app-catalog-page',
  templateUrl: './catalog-page.component.html',
  styleUrls: ['./catalog-page.component.scss'],
  standalone: true, // <- Si es standalone
  imports: [
    CommonModule,
    RouterModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    StoreLayoutComponent,
    ProductCatalogComponent // <- ¡IMPORTANTE! Agregar aquí
  ]
})
export class CatalogPageComponent implements OnInit {
  products: BaseProduct[] = [];
  totalProducts = 0;
  pageSize = 12;
  currentPage = 0;
  category: string | null = null;
  loading = true;
  pageTitle = 'Catálogo de Productos';

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.category = params['category'] || null;
      this.updatePageTitle();
      this.loadProducts();
    });

    this.route.queryParams.subscribe(params => {
      this.currentPage = params['page'] ? parseInt(params['page']) : 0;
      this.loadProducts();
    });
  }

  updatePageTitle(): void {
    if (this.category) {
      const categoryNames: { [key: string]: string } = {
        'book': 'Libros',
        'movie': 'Películas',
        'vinyl': 'Vinilos',
        'compact-disc': 'CDs'
      };
      this.pageTitle = `${categoryNames[this.category] || this.category} - MediaStore`;
    } else {
      this.pageTitle = 'Catálogo de Productos';
    }
  }

  loadProducts(): void {
    this.loading = true;
    
    const params: any = {
      page: this.currentPage,
      limit: this.pageSize
    };

    if (this.category && this.category !== 'all') {
      params.category = this.category;
    }

    this.apiService.get('/frontend/products', params).subscribe({
      next: (response: any) => {
        this.products = response.data || response;
        this.totalProducts = response.total || response.length;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void { // <- Recibe PageEvent
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: this.currentPage },
      queryParamsHandling: 'merge'
    });
    
    this.loadProducts();
  }

  onCategoryFilter(category: string): void { // <- Recibe string
    if (category === 'all') {
      this.router.navigate(['/store']);
    } else {
      this.router.navigate(['/store/category', category]);
    }
  }

  onSearch(query: string): void { // <- Recibe string
    // Implement search functionality
    console.log('Search:', query);
    // Puedes agregar lógica de búsqueda aquí
  }

  viewProductDetails(product: BaseProduct): void {
    this.router.navigate(['/store/product', product.id]);
  }
}
