import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent {
  @Input() loading = false;
  @Input() requiresTwoFactor = false;
  @Output() login = new EventEmitter<any>();
  @Output() verifyTwoFactor = new EventEmitter<string>();
  
  loginForm: FormGroup;
  twoFactorForm: FormGroup;
  hidePassword = true;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    
    this.twoFactorForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.login.emit(this.loginForm.value);
    }
  }

  onVerifyTwoFactor(): void {
    if (this.twoFactorForm.valid) {
      this.verifyTwoFactor.emit(this.twoFactorForm.value.code);
    }
  }
}
