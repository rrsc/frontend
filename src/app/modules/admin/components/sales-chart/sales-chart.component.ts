import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-sales-chart',
  templateUrl: './sales-chart.component.html',
  styleUrls: ['./sales-chart.component.scss']
})
export class SalesChartComponent implements OnInit, OnChanges {
  @Input() chartData: any = null;

  // Chart configuration
  public salesChartType: ChartType = 'line';
  public salesChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#666',
          font: {
            size: 12
          },
          padding: 20
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
        mode: 'index',
        intersect: false
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          color: '#666',
          font: {
            size: 11
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          color: '#666',
          font: {
            size: 11
          },
          callback: function(value) {
            if (typeof value === 'number') {
              if (value >= 1000) {
                return '$' + (value / 1000).toFixed(0) + 'K';
              }
              return '$' + value;
            }
            return value;
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    },
    elements: {
      line: {
        tension: 0.4
      },
      point: {
        radius: 4,
        hoverRadius: 6
      }
    }
  };

  public salesChartPlugins = [];

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
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'],
      datasets: [
        {
          label: 'Ventas',
          data: [120, 150, 180, 210, 240, 280, 320],
          backgroundColor: 'rgba(33, 150, 243, 0.1)',
          borderColor: '#2196F3',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        },
        {
          label: 'Ingresos',
          data: [1200, 1500, 1800, 2100, 2400, 2800, 3200],
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          borderColor: '#4CAF50',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }
      ]
    };
  }
}
