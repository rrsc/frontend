import { Component, Input } from '@angular/core';
import { DashboardMetrics } from '../../../../core/models/report.model';

@Component({
  selector: 'app-metrics-cards',
  templateUrl: './metrics-cards.component.html',
  styleUrls: ['./metrics-cards.component.scss']
})
export class MetricsCardsComponent {
  @Input() metrics!: DashboardMetrics;

  metricsCards = [
    {
      key: 'totalRevenue',
      title: 'Ingresos Totales',
      value: 0,
      icon: 'attach_money',
      color: 'primary',
      prefix: '$',
      suffix: '',
      trend: '+12.5%',
      trendPositive: true
    },
    {
      key: 'totalSales',
      title: 'Ventas Totales',
      value: 0,
      icon: 'shopping_cart',
      color: 'accent',
      prefix: '',
      suffix: ' ventas',
      trend: '+8.2%',
      trendPositive: true
    },
    {
      key: 'totalProducts',
      title: 'Productos',
      value: 0,
      icon: 'inventory_2',
      color: 'warn',
      prefix: '',
      suffix: ' productos',
      trend: '+3.1%',
      trendPositive: true
    },
    {
      key: 'pendingOrders',
      title: 'Pedidos Pendientes',
      value: 0,
      icon: 'pending_actions',
      color: 'primary',
      prefix: '',
      suffix: ' pedidos',
      trend: '-2.4%',
      trendPositive: false
    }
  ];

  ngOnChanges(): void {
    if (this.metrics) {
      this.updateMetricsValues();
    }
  }

  private updateMetricsValues(): void {
    this.metricsCards[0].value = this.metrics.totalRevenue;
    this.metricsCards[1].value = this.metrics.totalSales;
    this.metricsCards[2].value = this.metrics.totalProducts;
    this.metricsCards[3].value = this.metrics.pendingOrders;
  }

  getCardClass(card: any): string {
    return `metric-card ${card.color}`;
  }

  formatValue(value: number): string {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  }
}
