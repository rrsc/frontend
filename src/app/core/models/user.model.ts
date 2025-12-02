export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  isActive: boolean;
  isTwoFactorEnabled: boolean;
  roles: Role[];
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  avatar?: string;
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

// DTOs para creación y actualización
export interface UserCreateDto {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  isActive?: boolean;
  roleIds?: string[]; // Para asignar roles
}

export interface UserUpdateDto {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  isActive?: boolean;
  roleIds?: string[]; // Para actualizar roles
}

export interface UserPasswordChangeDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
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
