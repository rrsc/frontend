import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiService } from '../../../../core/services/api.service';
import { DashboardMetrics, SalesReport } from '../../../../core/models/report.model';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  loading = true;
  metrics: DashboardMetrics | null = null;
  salesReport: SalesReport | null = null;
  
  private subscriptions: Subscription[] = [];

  // Chart data
  salesChartData: any = null;
  inventoryChartData: any = null;
  
  // Date range
  dateRange = 'month'; // day, week, month, year

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadDashboardData(): void {
    this.loading = true;
    
    // Load metrics
    const metricsSub = this.apiService.getDashboardMetrics().subscribe({
      next: (metrics) => {
        this.metrics = metrics;
        this.prepareChartData();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading metrics:', error);
        this.loading = false;
      }
    });

    // Load sales report
    const salesSub = this.apiService.get('/reports/sales', {
      period: this.dateRange
    }).subscribe({
      next: (report) => {
        this.salesReport = report;
      },
      error: (error) => {
        console.error('Error loading sales report:', error);
      }
    });

    this.subscriptions.push(metricsSub, salesSub);
  }

  prepareChartData(): void {
    if (!this.metrics) return;

    // Sales chart data
    this.salesChartData = {
      labels: this.metrics.monthlySales.map(ms => ms.month),
      datasets: [
        {
          label: 'Ventas',
          data: this.metrics.monthlySales.map(ms => ms.sales),
          backgroundColor: 'rgba(33, 150, 243, 0.2)',
          borderColor: '#2196F3',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        },
        {
          label: 'Ingresos',
          data: this.metrics.monthlySales.map(ms => ms.revenue),
          backgroundColor: 'rgba(76, 175, 80, 0.2)',
          borderColor: '#4CAF50',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }
      ]
    };

    // Inventory chart data
    const lowStockCount = this.metrics.lowStockProducts;
    const normalStockCount = this.metrics.totalProducts - lowStockCount;
    
    this.inventoryChartData = {
      labels: ['Stock Normal', 'Stock Bajo'],
      datasets: [{
        data: [normalStockCount, lowStockCount],
        backgroundColor: [
          'rgba(76, 175, 80, 0.8)',
          'rgba(255, 152, 0, 0.8)'
        ],
        borderColor: [
          '#4CAF50',
          '#FF9800'
        ],
        borderWidth: 1
      }]
    };
  }

  onDateRangeChange(range: string): void {
    this.dateRange = range;
    this.loadDashboardData();
  }

  refreshDashboard(): void {
    this.loadDashboardData();
  }

  getSalesGrowth(): number {
    if (!this.metrics || this.metrics.monthlySales.length < 2) return 0;
    
    const current = this.metrics.monthlySales[this.metrics.monthlySales.length - 1].sales;
    const previous = this.metrics.monthlySales[this.metrics.monthlySales.length - 2].sales;
    
    if (previous === 0) return 100;
    return ((current - previous) / previous) * 100;
  }

  getRevenueGrowth(): number {
    if (!this.metrics || this.metrics.monthlySales.length < 2) return 0;
    
    const current = this.metrics.monthlySales[this.metrics.monthlySales.length - 1].revenue;
    const previous = this.metrics.monthlySales[this.metrics.monthlySales.length - 2].revenue;
    
    if (previous === 0) return 100;
    return ((current - previous) / previous) * 100;
  }
}
