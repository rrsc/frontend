import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common'; // <- Importar CommonModule
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';

import { ApiService } from '../../../../core/services/api.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Sale, SaleStatus, PaymentMethod } from '../../../../core/models/sale.model';
import { StoreLayoutComponent } from '../../layouts/store-layout/store-layout.component';

@Component({
  selector: 'app-order-confirmation-page',
  templateUrl: './order-confirmation-page.component.html',
  styleUrls: ['./order-confirmation-page.component.scss'],
  standalone: true, // <- Si es standalone
  imports: [
    CommonModule, // <- NECESARIO para CurrencyPipe
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
    StoreLayoutComponent,
    CurrencyPipe // <- También puedes importar el pipe específico
  ]
})
export class OrderConfirmationPageComponent implements OnInit {
  sale: Sale | null = null;
  loading = false;
  orderId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id');
    if (this.orderId) {
      this.loadOrder(this.orderId);
    }
  }

  loadOrder(id: string): void {
    this.loading = true;

    // TIPADO EXPLÍCITO: <Sale>
    this.apiService.get<Sale>(`/sales/${id}`).subscribe({
      next: (sale: Sale) => {
        this.sale = sale;
        this.loading = false;
      },
      error: (error: any) => {
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

    // TIPADO EXPLÍCITO: response as Blob
    this.apiService.get(`/reports/invoice/${this.orderId}`, {
      responseType: 'blob'
    }).subscribe({
      next: (response: any) => {
        const blob = response as Blob;
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `factura-${this.orderId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);

        this.notificationService.showSuccess('Factura descargada');
      },
      error: (error: any) => {
        console.error('Error downloading invoice:', error);
        this.notificationService.showError('Error al descargar la factura');
      }
    });
  }

  getPaymentMethodLabel(method: string | undefined): string {
    if (!method) return 'No especificado';

    const methods: Record<string, string> = {
      [PaymentMethod.CASH]: 'Efectivo',
      [PaymentMethod.CARD]: 'Tarjeta de crédito/débito',
      [PaymentMethod.TRANSFER]: 'Transferencia bancaria'
    };
    return methods[method] || method;
  }

  getStatusLabel(status: string | undefined): string {
    if (!status) return 'Desconocido';

    const statuses: Record<string, string> = {
      [SaleStatus.PENDING]: 'Pendiente',
      [SaleStatus.COMPLETED]: 'Completado',
      [SaleStatus.CANCELLED]: 'Cancelado',
      [SaleStatus.REFUNDED]: 'Reembolsado'
    };
    return statuses[status] || status;
  }

  getStatusColor(status: string | undefined): string {
    if (!status) return 'default';

    const colors: Record<string, string> = {
      [SaleStatus.PENDING]: 'warning',
      [SaleStatus.COMPLETED]: 'success',
      [SaleStatus.CANCELLED]: 'error',
      [SaleStatus.REFUNDED]: 'info'
    };
    return colors[status] || 'default';
  }
}
