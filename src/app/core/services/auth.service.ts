import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { TokenService } from './token.service';
import { User, LoginRequest, LoginResponse, TwoFactorSetup } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private tokenService: TokenService,
    private router: Router
  ) {
    this.loadCurrentUser();
  }

  private loadCurrentUser(): void {
    const user = this.tokenService.getUser();
    if (user && this.tokenService.isValidToken()) {
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
    } else {
      this.logout();
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.apiService.login(credentials).pipe(
      map((response: LoginResponse) => {
        if (!response.requiresTwoFactor) {
          this.handleLoginSuccess(response);
        }
        return response;
      })
    );
  }

  verifyTwoFactor(code: string): Observable<LoginResponse> {
    return this.apiService.post('/auth/verify-2fa', { code }).pipe(
      map((response: LoginResponse) => {
        this.handleLoginSuccess(response);
        return response;
      })
    );
  }

  private handleLoginSuccess(response: LoginResponse): void {
    this.tokenService.saveTokens(response.accessToken, response.refreshToken);
    this.tokenService.saveUser(response.user);
    this.currentUserSubject.next(response.user);
    this.isAuthenticatedSubject.next(true);
  }

  logout(): void {
    this.apiService.logout().subscribe({
      next: () => this.clearAuth(),
      error: () => this.clearAuth()
    });
  }

  private clearAuth(): void {
    this.tokenService.clearTokens();
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/auth/login']);
  }

  refreshToken(): Observable<any> {
    return this.apiService.refreshToken().pipe(
      map((response: any) => {
        this.tokenService.saveTokens(response.accessToken, response.refreshToken);
        return response;
      })
    );
  }

  generateTwoFactorSecret(): Observable<TwoFactorSetup> {
    return this.apiService.generate2FA();
  }

  enableTwoFactor(code: string): Observable<any> {
    return this.apiService.post('/auth/2fa/enable', { code });
  }

  disableTwoFactor(code: string): Observable<any> {
    return this.apiService.post('/auth/2fa/disable', { code });
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    return user.roles.some(r => r.name === role);
  }

  hasPermission(resource: string, action: string): Observable<boolean> {
    return this.apiService.checkPermission(resource, action);
  }
}
