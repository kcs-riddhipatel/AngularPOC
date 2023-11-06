import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  registerForm!: FormGroup;
  roles: string[] = [];
  formSubmitted = false;
  registrationError: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      Username: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.required, Validators.minLength(8)]],
      role: ['', Validators.required],
      ConfirmPassword: ['', Validators.required]
    }, {
      validator: this.passwordMatchValidator()
    });

    this.authService.getRoles()
      .pipe(
        catchError(error => {
          console.error(error);
          return of([]);
        })
      )
      .subscribe(roles => {
        this.roles = roles;
      });
  }

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const password = control.get('Password');
      const confirmPassword = control.get('ConfirmPassword');

      if (password && confirmPassword && password.value !== confirmPassword.value) {
        return { passwordMismatch: true };
      }
      return null;
    };
  }

  register() {
    this.formSubmitted = true;
    this.markFormGroupTouched(this.registerForm);

    if (this.registerForm.valid) {
      this.authService.registerUser(this.registerForm.value)
        .pipe(
          catchError(error => {
            this.registrationError = error.message || 'Registration failed. Please try again later.';
            console.error('Registration error:', error);
            return of(null);
          })
        )
        .subscribe(response => {
          if (response) {
            alert("User created successfully!");
            this.router.navigate(['/home']);
          }
        });
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  getUsernameControl() {
    return (this.registerForm as FormGroup).get('Username');
  }

  getEmailControl() {
    return (this.registerForm as FormGroup).get('Email');
  }

  getPasswordControl() {
    return (this.registerForm as FormGroup).get('Password');
  }

  getconfirmPasswordControl() {
    return (this.registerForm as FormGroup).get('ConfirmPassword');
  }
}
