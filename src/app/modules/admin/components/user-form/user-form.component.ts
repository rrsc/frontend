import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User, UserCreateDto, UserUpdateDto, Role } from '../../../../core/models/user.model';
import { ApiService } from '../../../../core/services/api.service';
import { NotificationService } from '../../../../core/services/notification.service';

export interface UserFormData {
  mode: 'create' | 'edit';
  user?: User;
}

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  loading = false;
  roles: Role[] = [];
  passwordVisible = false;
  confirmPasswordVisible = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<UserFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserFormData
  ) {
    this.userForm = this.createUserForm();
  }

  ngOnInit(): void {
    this.loadRoles();
    
    if (this.data.mode === 'edit' && this.data.user) {
      this.patchFormWithUser(this.data.user);
      
      // En modo edición, los campos de contraseña no son requeridos
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('confirmPassword')?.clearValidators();
      this.userForm.get('password')?.updateValueAndValidity();
      this.userForm.get('confirmPassword')?.updateValueAndValidity();
    }
  }

  createUserForm(): FormGroup {
    return this.fb.group({
      // Información básica
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      firstName: [''],
      lastName: [''],
      
      // Contraseña (solo para creación)
      password: ['', this.data.mode === 'create' ? [Validators.required, Validators.minLength(6)] : []],
      confirmPassword: ['', this.data.mode === 'create' ? [Validators.required] : []],
      
      // Información de contacto
      phone: [''],
      address: [''],
      city: [''],
      state: [''],
      country: [''],
      postalCode: [''],
      
      // Roles
      roleIds: [[]],
      
      // Estado
      isActive: [true],
      isTwoFactorEnabled: [false]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    
    return null;
  }

  loadRoles(): void {
    this.apiService.getRoles().subscribe({
      next: (response: any) => {
        this.roles = response.data || response;
      },
      error: (error) => {
        console.error('Error loading roles:', error);
        this.notificationService.showError('Error al cargar roles');
      }
    });
  }

  patchFormWithUser(user: User): void {
    this.userForm.patchValue({
      username: user.username,
      email: user.email,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phone: user.phone || '',
      address: user.address || '',
      city: user.city || '',
      state: user.state || '',
      country: user.country || '',
      postalCode: user.postalCode || '',
      isActive: user.isActive,
      isTwoFactorEnabled: user.isTwoFactorEnabled,
      roleIds: user.roles.map(role => role.id) // Convertir roles a array de IDs
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.markFormGroupTouched(this.userForm);
      this.notificationService.showError('Por favor completa los campos requeridos correctamente');
      return;
    }

    this.loading = true;
    
    const formValue = this.userForm.value;
    
    if (this.data.mode === 'create') {
      this.createUser(formValue);
    } else {
      this.updateUser(formValue);
    }
  }

  createUser(userData: any): void {
    const userCreateDto: UserCreateDto = {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      firstName: userData.firstName || undefined,
      lastName: userData.lastName || undefined,
      phone: userData.phone || undefined,
      address: userData.address || undefined,
      city: userData.city || undefined,
      state: userData.state || undefined,
      country: userData.country || undefined,
      postalCode: userData.postalCode || undefined,
      isActive: userData.isActive,
      roleIds: userData.roleIds
    };

    this.apiService.createUser(userCreateDto).subscribe({
      next: (response) => {
        this.loading = false;
        this.notificationService.showSuccess('Usuario creado exitosamente');
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.loading = false;
        console.error('Error creating user:', error);
        this.notificationService.showError(
          error.error?.message || 'Error al crear usuario'
        );
      }
    });
  }

  updateUser(userData: any): void {
    if (!this.data.user?.id) return;
    
    const userUpdateDto: UserUpdateDto = {
      username: userData.username,
      email: userData.email,
      firstName: userData.firstName || undefined,
      lastName: userData.lastName || undefined,
      phone: userData.phone || undefined,
      address: userData.address || undefined,
      city: userData.city || undefined,
      state: userData.state || undefined,
      country: userData.country || undefined,
      postalCode: userData.postalCode || undefined,
      isActive: userData.isActive,
      roleIds: userData.roleIds
    };

    this.apiService.updateUser(this.data.user.id, userUpdateDto).subscribe({
      next: (response) => {
        this.loading = false;
        this.notificationService.showSuccess('Usuario actualizado exitosamente');
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.loading = false;
        console.error('Error updating user:', error);
        this.notificationService.showError(
          error.error?.message || 'Error al actualizar usuario'
        );
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  getTitle(): string {
    return this.data.mode === 'create' ? 'Nuevo Usuario' : 'Editar Usuario';
  }

  getButtonText(): string {
    return this.data.mode === 'create' ? 'Crear Usuario' : 'Actualizar Usuario';
  }

  // Getters para acceder fácilmente a los controles del formulario
  get username() { return this.userForm.get('username'); }
  get email() { return this.userForm.get('email'); }
  get password() { return this.userForm.get('password'); }
  get confirmPassword() { return this.userForm.get('confirmPassword'); }
}
