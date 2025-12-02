import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-two-factor-page',
  templateUrl: './two-factor-page.component.html',
  styleUrls: ['./two-factor-page.component.scss']
})
export class TwoFactorPageComponent {
  constructor(private router: Router) {}

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
