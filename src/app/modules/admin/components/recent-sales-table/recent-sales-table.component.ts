import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';

export interface RecentSale {
  id: string;
  customerName: string;
  date: Date;
  amount: number;
  status: string;
  items: number;
}

@Component({
  selector: 'app-recent-sales-table',
  templateUrl: './recent-sales-table.component.html',
  styleUrls: ['./recent-sales-table.component.scss']
})
export class RecentSalesTableComponent implements OnInit {
  recentSales: RecentSale[] = [];
  loading = false;

  displayedColumns: string[] = ['customer', 'date', 'amount', 'status', 'actions'];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadRecentSales();
  }

  loadRecentSales(): void {
    this.loading = true;
    
    this.apiService.getSales({ limit: 5, sort: '-createdAt' }).subscribe({
      next: (response: any) => {
        const sales = response.data || response;
        this.recentSales = sales.slice(0, 5).map((sale: any) => ({
          id: sale.id,
          customerName: sale.customer?.name || 'Cliente no registrado',
          date: new Date(sale.createdAt),
          amount: sale.total,
          status: sale.status,
          items: sale.items?.length || 0
        }));
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading recent sales:', error);
        this.loadSampleData();
        this.loading = false;
      }
    });
  }

  loadSampleData(): void {
    this.recentSales = [
      { id: '1', customerName: 'Juan Pérez', date: new Date('2024-01-15'), amount: 245.50, status: 'completed', items: 3 },
      { id: '2', customerName: 'María García', date: new Date('2024-01-14'), amount: 189.99, status: 'completed', items: 2 },
      { id: '3', customerName: 'Carlos López', date: new Date('2024-01-13'), amount: 320.75, status: 'pending', items: 4 },
      { id: '4', customerName: 'Ana Martínez', date: new Date('2024-01-12'), amount: 156.30, status: 'completed', items: 1 },
      { id: '5', customerName: 'Pedro Rodríguez', date: new Date('2024-01-11'), amount: 432.20, status: 'cancelled', items: 5 }
    ];
  }

  getStatusLabel(status: string): string {
    const statuses: { [key: string]: string } = {
      'pending': 'Pendiente',
      'completed': 'Completado',
      'cancelled': 'Cancelado',
      'refunded': 'Reembolsado'
    };
    return statuses[status] || status;
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'pending': 'warning',
      'completed': 'success',
      'cancelled': 'error',
      'refunded': 'info'
    };
    return colors[status] || 'default';
  }

  viewSale(saleId: string): void {
    console.log('View sale:', saleId);
    // Navigate to sale detail
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }
}
