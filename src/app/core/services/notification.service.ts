import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private toastr: ToastrService) {}

  showSuccess(message: string, title: string = 'Éxito'): void {
    this.toastr.success(message, title, {
      positionClass: 'toast-top-right',
      timeOut: 3000,
      progressBar: true,
      closeButton: true
    });
  }

  showError(message: string, title: string = 'Error'): void {
    this.toastr.error(message, title, {
      positionClass: 'toast-top-right',
      timeOut: 5000,
      progressBar: true,
      closeButton: true,
      disableTimeOut: false
    });
  }

  showInfo(message: string, title: string = 'Información'): void {
    this.toastr.info(message, title, {
      positionClass: 'toast-top-right',
      timeOut: 4000,
      progressBar: true,
      closeButton: true
    });
  }

  showWarning(message: string, title: string = 'Advertencia'): void {
    this.toastr.warning(message, title, {
      positionClass: 'toast-top-right',
      timeOut: 5000,
      progressBar: true,
      closeButton: true
    });
  }

  // Custom notification with options
  showCustom(
    message: string,
    title: string = '',
    type: 'success' | 'error' | 'info' | 'warning' = 'info',
    options?: any
  ): void {
    const defaultOptions = {
      positionClass: 'toast-top-right',
      timeOut: 4000,
      progressBar: true,
      closeButton: true
    };

    const finalOptions = { ...defaultOptions, ...options };

    switch (type) {
      case 'success':
        this.toastr.success(message, title, finalOptions);
        break;
      case 'error':
        this.toastr.error(message, title, finalOptions);
        break;
      case 'info':
        this.toastr.info(message, title, finalOptions);
        break;
      case 'warning':
        this.toastr.warning(message, title, finalOptions);
        break;
    }
  }

  // Clear all notifications
  clearAll(): void {
    this.toastr.clear();
  }
}
