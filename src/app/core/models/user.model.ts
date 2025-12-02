export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isActive: boolean;
  isTwoFactorEnabled: boolean;
  roles: Role[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
}

export interface Permission {
  resource: string;
  action: string;
}

export interface LoginRequest {
  username: string;
  password: string;
  twoFactorCode?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  requiresTwoFactor: boolean;
}

export interface TwoFactorSetup {
  secret: string;
  qrCode: string;
}
