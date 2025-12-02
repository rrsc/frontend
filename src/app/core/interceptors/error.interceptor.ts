import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private notificationService: NotificationService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Ha ocurrido un error inesperado';
        
        if (error.error instanceof ErrorEvent) {
          // Error del lado del cliente
          errorMessage = error.error.message;
        } else {
          // Error del servidor
          switch (error.status) {
            case 400:
              errorMessage = error.error.message || 'Solicitud incorrecta';
              break;
            case 401:
              errorMessage = 'No autorizado. Por favor inicie sesión.';
              break;
            case 403:
              errorMessage = 'No tiene permisos para realizar esta acción';
              break;
            case 404:
              errorMessage = 'Recurso no encontrado';
              break;
            case 409:
              errorMessage = 'Conflicto: ' + (error.error.message || 'El recurso ya existe');
              break;
            case 422:
              errorMessage = 'Error de validación';
              break;
            case 500:
              errorMessage = 'Error interno del servidor';
              break;
            default:
              errorMessage = `Error ${error.status}: ${error.message}`;
          }
        }

        // Mostrar notificación
        this.notificationService.showError(errorMessage);
        
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
