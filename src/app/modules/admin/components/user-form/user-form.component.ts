import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User, UserCreateDto, UserUpdateDto } from '../../../../core/models/user.model';

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
  isSubmitting = false;
  hidePassword = true;
  roles = ['USER', 'ADMIN', 'MODERATOR'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserFormData
  ) {
    this.userForm = this.createForm();
  }

  ngOnInit() {
    if (this.data.mode === 'edit' && this.data.user) {
      this.patchFormWithUser(this.data.user);
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      role: ['USER', Validators.required],
      phone: ['', Validators.pattern(/^\+?[\d\s-]+$/)],
      address: [''],
      city: [''],
      country: [''],
      postalCode: [''],
      active: [true],
      
      // Solo en creación
      password: ['', this.data.mode === 'create' ? [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)
      ] : []],
      confirmPassword: ['', this.data.mode === 'create' ? [Validators.required] : []]
    }, { validators: this.passwordMatchValidator });
  }

  patchFormWithUser(user: User) {
    this.userForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      role: user.role,
      phone: user.phone || '',
      address: user.address || '',
      city: user.city || '',
      country: user.country || '',
      postalCode: user.postalCode || '',
      active: user.active
    });

    // Deshabilitar email en modo edición
    this.userForm.get('email')?.disable();
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    
    if (group.get('password')?.dirty || group.get('confirmPassword')?.dirty) {
      return password === confirmPassword ? null : { passwordMismatch: true };
    }
    return null;
  }

  getFormData(): UserCreateDto | UserUpdateDto {
    const formValue = this.userForm.getRawValue();
    
    const baseData = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      username: formValue.username,
      role: formValue.role,
      phone: formValue.phone || undefined,
      address: formValue.address || undefined,
      city: formValue.city || undefined,
      country: formValue.country || undefined,
      postalCode: formValue.postalCode || undefined,
      active: formValue.active
    };

    if (this.data.mode === 'create') {
      return {
        ...baseData,
        password: formValue.password
      } as UserCreateDto;
    } else {
      return baseData as UserUpdateDto;
    }
  }

  onSubmit() {
    if (this.userForm.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    
    // Simular llamada API
    setTimeout(() => {
      const formData = this.getFormData();
      this.dialogRef.close(formData);
      this.isSubmitting = false;
    }, 1000);
  }

  onCancel() {
    this.dialogRef.close();
  }

  // Getters para validación
  get firstName() { return this.userForm.get('firstName'); }
  get lastName() { return this.userForm.get('lastName'); }
  get email() { return this.userForm.get('email'); }
  get username() { return this.userForm.get('username'); }
  get password() { return this.userForm.get('password'); }
  get confirmPassword() { return this.userForm.get('confirmPassword'); }
  get phone() { return this.userForm.get('phone'); }

  // Mensajes de error
  getErrorMessage(control: any) {
    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (control?.hasError('email')) {
      return 'Email no válido';
    }
    if (control?.hasError('minlength')) {
      return `Mínimo ${control.errors?.['minlength'].requiredLength} caracteres`;
    }
    if (control?.hasError('pattern')) {
      if (control === this.password) {
        return 'La contraseña debe contener mayúsculas, minúsculas y números';
      }
      if (control === this.phone) {
        return 'Número de teléfono no válido';
      }
    }
    return '';
  }
}
