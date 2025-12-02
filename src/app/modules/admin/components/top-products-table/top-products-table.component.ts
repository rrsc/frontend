import { Component, Input, OnInit } from '@angular/core';
import { TopProduct } from '../../../../core/models/report.model';

@Component({
  selector: 'app-top-products-table',
  templateUrl: './top-products-table.component.html',
  styleUrls: ['./top-products-table.component.scss']
})
export class TopProductsTableComponent implements OnInit {
  @Input() products: TopProduct[] = [];

  displayedColumns: string[] = ['position', 'name', 'sales', 'revenue', 'actions'];
  dataSource: any[] = [];

  ngOnInit(): void {
    this.prepareTableData();
  }

  ngOnChanges(): void {
    this.prepareTableData();
  }

  private prepareTableData(): void {
    if (this.products && this.products.length > 0) {
      this.dataSource = this.products.map((product, index) => ({
        position: index + 1,
        name: product.name,
        sales: product.sales,
        revenue: product.revenue,
        productId: product.productId
      }));
    } else {
      // Sample data
      this.dataSource = [
        { position: 1, name: 'The Great Gatsby (Libro)', sales: 156, revenue: 3120, productId: '1' },
        { position: 2, name: 'Inception (Película)', sales: 128, revenue: 2560, productId: '2' },
        { position: 3, name: 'The Dark Side of the Moon (Vinilo)', sales: 98, revenue: 1960, productId: '3' },
        { position: 4, name: 'Thriller (CD)', sales: 87, revenue: 1740, productId: '4' },
        { position: 5, name: '1984 (Libro)', sales: 76, revenue: 1520, productId: '5' }
      ];
    }
  }

  viewProduct(productId: string): void {
    console.log('View product:', productId);
    // Navigate to product detail
  }

  getTrendIcon(index: number): string {
    if (index === 0) return 'trending_up';
    if (index === 1) return 'trending_flat';
    return 'trending_down';
  }

  getTrendColor(index: number): string {
    if (index === 0) return 'primary';
    if (index === 1) return 'accent';
    return 'warn';
  }
}
