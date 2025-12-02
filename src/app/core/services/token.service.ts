import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private jwtHelper = new JwtHelperService();

  constructor(private cookieService: CookieService) {}

  saveTokens(accessToken: string, refreshToken: string): void {
    this.cookieService.set(environment.tokenKey, accessToken, {
      path: '/',
      secure: environment.production,
      sameSite: 'Strict'
    });
    
    this.cookieService.set(environment.refreshTokenKey, refreshToken, {
      path: '/',
      secure: environment.production,
      sameSite: 'Strict'
    });
  }

  getAccessToken(): string | null {
    return this.cookieService.get(environment.tokenKey) || null;
  }

  getRefreshToken(): string | null {
    return this.cookieService.get(environment.refreshTokenKey) || null;
  }

  clearTokens(): void {
    this.cookieService.delete(environment.tokenKey, '/');
    this.cookieService.delete(environment.refreshTokenKey, '/');
    localStorage.removeItem(environment.userKey);
  }

  isValidToken(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;
    return !this.jwtHelper.isTokenExpired(token);
  }

  getTokenExpiration(): Date | null {
    const token = this.getAccessToken();
    if (!token) return null;
    return this.jwtHelper.getTokenExpirationDate(token);
  }

  saveUser(user: User): void {
    localStorage.setItem(environment.userKey, JSON.stringify(user));
  }

  getUser(): User | null {
    const userStr = localStorage.getItem(environment.userKey);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  getDecodedToken(): any {
    const token = this.getAccessToken();
    if (!token) return null;
    return this.jwtHelper.decodeToken(token);
  }

  getUserId(): string | null {
    const decoded = this.getDecodedToken();
    return decoded?.sub || null;
  }
}
