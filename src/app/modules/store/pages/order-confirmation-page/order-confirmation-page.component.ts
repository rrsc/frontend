import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Sale } from '../../../core/models/sale.model';

@Component({
  selector: 'app-order-confirmation-page',
  templateUrl: './order-confirmation-page.component.html',
  styleUrls: ['./order-confirmation-page.component.scss']
})
export class OrderConfirmationPageComponent implements OnInit {
  sale: Sale | null = null;
  loading = false;
  orderId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id');
    if (this.orderId) {
      this.loadOrder(this.orderId);
    }
  }

  loadOrder(id: string): void {
    this.loading = true;
    this.apiService.get(`/sales/${id}`).subscribe({
      next: (sale) => {
        this.sale = sale;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading order:', error);
        this.notificationService.showError('No se pudo cargar la información del pedido');
        this.loading = false;
      }
    });
  }

  printOrder(): void {
    window.print();
  }

  downloadInvoice(): void {
    if (!this.orderId) return;
    
    this.apiService.get(`/reports/invoice/${this.orderId}`, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `factura-${this.orderId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error downloading invoice:', error);
        this.notificationService.showError('Error al descargar la factura');
      }
    });
  }

  getPaymentMethodLabel(method: string): string {
    const methods: { [key: string]: string } = {
      'cash': 'Efectivo',
      'card': 'Tarjeta de crédito/débito',
      'transfer': 'Transferencia bancaria'
    };
    return methods[method] || method;
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
}
