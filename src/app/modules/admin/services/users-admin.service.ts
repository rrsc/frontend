import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { User, UserCreateDto, UserUpdateDto } from '../../../core/models/user.model';
import { PaginatedResponse } from '../../../core/models/api.model';

@Injectable({
  providedIn: 'root'
})
export class UsersAdminService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  // Obtener todos los usuarios con paginación
  getUsers(page: number = 1, limit: number = 10, search?: string, role?: string): Observable<PaginatedResponse<User>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (search) {
      params = params.set('search', search);
    }

    if (role) {
      params = params.set('role', role);
    }

    return this.http.get<PaginatedResponse<User>>(this.apiUrl, { params });
  }

  // Obtener un usuario por ID
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo usuario
  createUser(userData: UserCreateDto): Observable<User> {
    return this.http.post<User>(this.apiUrl, userData);
  }

  // Actualizar usuario
  updateUser(id: string, userData: UserUpdateDto): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}`, userData);
  }

  // Eliminar usuario (soft delete)
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Restaurar usuario
  restoreUser(id: string): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}/restore`, {});
  }

  // Cambiar estado activo/inactivo
  toggleUserStatus(id: string, active: boolean): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}/status`, { active });
  }

  // Cambiar rol de usuario
  changeUserRole(id: string, role: string): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}/role`, { role });
  }

  // Obtener estadísticas de usuarios
  getUserStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`);
  }
}
