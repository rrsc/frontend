import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  loginForm: FormGroup;
  twoFactorForm: FormGroup;
  isLoading = false;
  requiresTwoFactor = false;
  returnUrl = '/store';
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });

    this.twoFactorForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/store';
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        if (response.requiresTwoFactor) {
          this.requiresTwoFactor = true;
          this.notificationService.showInfo('Ingresa el código de verificación');
        } else {
          this.router.navigate([this.returnUrl]);
          this.notificationService.showSuccess('Inicio de sesión exitoso');
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.notificationService.showError(error.message);
        this.isLoading = false;
      }
    });
  }

  onVerifyTwoFactor(): void {
    if (this.twoFactorForm.invalid) {
      this.twoFactorForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.authService.verifyTwoFactor(this.twoFactorForm.value.code).subscribe({
      next: () => {
        this.router.navigate([this.returnUrl]);
        this.notificationService.showSuccess('Verificación exitosa');
        this.isLoading = false;
      },
      error: (error) => {
        this.notificationService.showError('Código inválido');
        this.isLoading = false;
      }
    });
  }

  goBackToLogin(): void {
    this.requiresTwoFactor = false;
    this.twoFactorForm.reset();
  }
}
