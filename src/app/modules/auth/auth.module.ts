import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from '../../shared/shared.module';

// Pages
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { TwoFactorPageComponent } from './pages/two-factor-page/two-factor-page.component';
import { ForgotPasswordPageComponent } from './pages/forgot-password-page/forgot-password-page.component';
import { ResetPasswordPageComponent } from './pages/reset-password-page/reset-password-page.component';

// Components
import { LoginFormComponent } from './components/login-form/login-form.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { TwoFactorFormComponent } from './components/two-factor-form/two-factor-form.component';
import { ForgotPasswordFormComponent } from './components/forgot-password-form/forgot-password-form.component';
import { ResetPasswordFormComponent } from './components/reset-password-form/reset-password-form.component';

@NgModule({
  declarations: [
    // Pages
    LoginPageComponent,
    RegisterPageComponent,
    TwoFactorPageComponent,
    ForgotPasswordPageComponent,
    ResetPasswordPageComponent,
    
    // Components
    LoginFormComponent,
    RegisterFormComponent,
    TwoFactorFormComponent,
    ForgotPasswordFormComponent,
    ResetPasswordFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    SharedModule
  ],
  exports: [
    LoginPageComponent
  ]
})
export class AuthModule { }
