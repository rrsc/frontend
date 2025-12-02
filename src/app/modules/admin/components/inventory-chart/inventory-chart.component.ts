import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-inventory-chart',
  templateUrl: './inventory-chart.component.html',
  styleUrls: ['./inventory-chart.component.scss']
})
export class InventoryChartComponent implements OnInit, OnChanges {
  @Input() chartData: any = null;

  // Chart configuration
  public inventoryChartType: ChartType = 'doughnut';
  public inventoryChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          color: '#666',
          font: {
            size: 12
          },
          padding: 20,
          boxWidth: 12,
          usePointStyle: true
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 6,
        displayColors: true,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((Number(value) / total) * 100);
            return `${label}: ${value} productos (${percentage}%)`;
          }
        }
      }
    },
    cutout: '65%'
  };

  public inventoryChartPlugins = [];

  ngOnInit(): void {
    if (!this.chartData) {
      this.loadSampleData();
    }
  }

  ngOnChanges(): void {
    if (!this.chartData) {
      this.loadSampleData();
    }
  }

  private loadSampleData(): void {
    this.chartData = {
      labels: ['Stock Normal', 'Stock Bajo'],
      datasets: [{
        data: [85, 15],
        backgroundColor: [
          'rgba(76, 175, 80, 0.8)',
          'rgba(255, 152, 0, 0.8)'
        ],
        borderColor: [
          '#4CAF50',
          '#FF9800'
        ],
        borderWidth: 1,
        hoverOffset: 10
      }]
    };
  }
}
