import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { ApiService } from '../../core/services/api.service';
import { BaseProduct, ProductCategory } from '../../core/models/product.model';

@Component({
  selector: 'app-catalog-page',
  templateUrl: './catalog-page.component.html',
  styleUrls: ['./catalog-page.component.scss']
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

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    
    // Update URL without reloading
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: this.currentPage },
      queryParamsHandling: 'merge'
    });
    
    this.loadProducts();
  }

  onCategoryFilter(category: string): void {
    if (category === 'all') {
      this.router.navigate(['/store']);
    } else {
      this.router.navigate(['/store/category', category]);
    }
  }

  onSearch(query: string): void {
    // Implement search functionality
    console.log('Search:', query);
  }

  viewProductDetails(product: BaseProduct): void {
    this.router.navigate(['/store/product', product.id]);
  }
}
