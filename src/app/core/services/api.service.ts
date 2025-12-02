import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Generic methods
  get<T>(endpoint: string, params?: any, options?: any): Observable<T> {
    const httpOptions = this.buildOptions(options);
    if (params) {
      let httpParams = new HttpParams();
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
      httpOptions.params = httpParams;
    }
    return this.http.get<T>(`${this.baseUrl}${endpoint}`, httpOptions);
  }

  post<T>(endpoint: string, data: any, options?: any): Observable<T> {
    const httpOptions = this.buildOptions(options);
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, data, httpOptions);
  }

  put<T>(endpoint: string, data: any, options?: any): Observable<T> {
    const httpOptions = this.buildOptions(options);
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, data, httpOptions);
  }

  patch<T>(endpoint: string, data: any, options?: any): Observable<T> {
    const httpOptions = this.buildOptions(options);
    return this.http.patch<T>(`${this.baseUrl}${endpoint}`, data, httpOptions);
  }

  delete<T>(endpoint: string, options?: any): Observable<T> {
    const httpOptions = this.buildOptions(options);
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`, httpOptions);
  }

  private buildOptions(options?: any): any {
    const defaultOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return { ...defaultOptions, ...options };
  }

  // Auth endpoints
  login(data: any): Observable<any> {
    return this.post('/auth/login', data);
  }

  logout(): Observable<any> {
    return this.post('/auth/logout', {});
  }

  refreshToken(): Observable<any> {
    return this.post('/auth/refresh', {});
  }

  generate2FA(): Observable<any> {
    return this.post('/auth/2fa/generate', {});
  }

  verify2FA(code: string): Observable<any> {
    return this.post('/auth/verify-2fa', { code });
  }

  // Products endpoints
  getProducts(params?: any): Observable<any> {
    return this.get('/products', params);
  }

  getProduct(id: string): Observable<any> {
    return this.get(`/products/${id}`);
  }

  createProduct(data: any): Observable<any> {
    return this.post('/products', data);
  }

  updateProduct(id: string, data: any): Observable<any> {
    return this.put(`/products/${id}`, data);
  }

  deleteProduct(id: string): Observable<any> {
    return this.delete(`/products/${id}`);
  }

  updateStock(id: string, data: any): Observable<any> {
    return this.patch(`/products/${id}/stock`, data);
  }

  // Specific product types
  getBooks(params?: any): Observable<any> {
    return this.get('/books', params);
  }

  getMovies(params?: any): Observable<any> {
    return this.get('/movies', params);
  }

  getVinyls(params?: any): Observable<any> {
    return this.get('/vinyls', params);
  }

  getCompactDiscs(params?: any): Observable<any> {
    return this.get('/compact-discs', params);
  }

  // Shopping Cart
  getCart(): Observable<any> {
    return this.get('/shopping-cart');
  }

  addToCart(data: any): Observable<any> {
    return this.post('/shopping-cart/items', data);
  }

  updateCartItem(productId: string, quantity: number): Observable<any> {
    return this.put(`/shopping-cart/items/${productId}`, { quantity });
  }

  removeFromCart(productId: string): Observable<any> {
    return this.delete(`/shopping-cart/items/${productId}`);
  }

  clearCart(): Observable<any> {
    return this.delete('/shopping-cart');
  }

  checkout(data: any): Observable<any> {
    return this.post('/shopping-cart/checkout', data);
  }

  // Sales
  getSales(params?: any): Observable<any> {
    return this.get('/sales', params);
  }

  createSale(data: any): Observable<any> {
    return this.post('/sales', data);
  }

  getSale(id: string): Observable<any> {
    return this.get(`/sales/${id}`);
  }

  // Reports
  getDashboardMetrics(): Observable<any> {
    return this.get('/reports/dashboard');
  }

  getInventoryReport(): Observable<any> {
    return this.get('/reports/inventory/pdf', { responseType: 'blob' });
  }

  getSalesReport(params?: any): Observable<any> {
    return this.get('/reports/sales/pdf', { 
      params,
      responseType: 'blob' 
    });
  }

  getInventoryProjection(): Observable<any> {
    return this.get('/reports/inventory/projection');
  }

  getSalesProjection(): Observable<any> {
    return this.get('/reports/sales/projection');
  }

  getProductTrends(): Observable<any> {
    return this.get('/reports/products/trends');
  }

  // Users
  getUsers(params?: any): Observable<any> {
    return this.get('/users', params);
  }

  getUser(id: string): Observable<any> {
    return this.get(`/users/${id}`);
  }

  createUser(data: any): Observable<any> {
    return this.post('/users', data);
  }

  updateUser(id: string, data: any): Observable<any> {
    return this.put(`/users/${id}`, data);
  }

  deleteUser(id: string): Observable<any> {
    return this.delete(`/users/${id}`);
  }

  updateUserPassword(id: string, data: any): Observable<any> {
    return this.patch(`/users/${id}/password`, data);
  }

  updateUserRoles(id: string, data: any): Observable<any> {
    return this.patch(`/users/${id}/roles`, data);
  }

  // Roles
  getRoles(params?: any): Observable<any> {
    return this.get('/roles', params);
  }

  getRole(id: string): Observable<any> {
    return this.get(`/roles/${id}`);
  }

  createRole(data: any): Observable<any> {
    return this.post('/roles', data);
  }

  updateRole(id: string, data: any): Observable<any> {
    return this.put(`/roles/${id}`, data);
  }

  deleteRole(id: string): Observable<any> {
    return this.delete(`/roles/${id}`);
  }

  // Casbin
  checkPermission(resource: string, action: string): Observable<any> {
    return this.get('/casbin-management/check-permission', { resource, action });
  }

  getUserRoles(username: string): Observable<any> {
    return this.get(`/casbin-management/users/${username}/roles`);
  }

  addPolicy(data: any): Observable<any> {
    return this.post('/casbin-management/policies', data);
  }

  removePolicy(data: any): Observable<any> {
    return this.delete('/casbin-management/policies', { body: data });
  }

  assignRole(data: any): Observable<any> {
    return this.post('/casbin-management/roles', data);
  }

  removeRole(data: any): Observable<any> {
    return this.delete('/casbin-management/roles', { body: data });
  }

  // Customers
  getCustomers(params?: any): Observable<any> {
    return this.get('/customers', params);
  }

  // Persons
  getPersons(params?: any): Observable<any> {
    return this.get('/persons', params);
  }

  searchPersons(query: string): Observable<any> {
    return this.get('/persons/search', { query });
  }

  // Frontend products
  getFrontendProducts(params?: any): Observable<any> {
    return this.get('/frontend/products', params);
  }

  getFrontendProduct(id: string): Observable<any> {
    return this.get(`/frontend/products/${id}`);
  }
}
