import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (this.email && this.password) {
      this.authService.login(this.email, this.password)
        .pipe(
          map((response) => {
            return response;
          }),
          catchError((error) => {
            console.error('Login error: ', error);
            return of(null);
          })
        )
        .subscribe((response) => {
          if (response) {
            this.router.navigate(['/home']);
          } else {
            console.error('Empty or null response received.');
          }
        });
    }
  }
}
