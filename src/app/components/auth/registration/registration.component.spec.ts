import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RegistrationComponent } from './registration.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../../auth.service';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('RegistrationComponent', () => {
  let component: RegistrationComponent;
  let fixture: ComponentFixture<RegistrationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistrationComponent],
      imports: [HttpClientTestingModule, ReactiveFormsModule],
      providers: [AuthService],
    });
    fixture = TestBed.createComponent(RegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form correctly', () => {
    expect(component.registerForm).toBeDefined();
    expect(component.registerForm.get('Username')).toBeDefined();
    expect(component.registerForm.get('Email')).toBeDefined();
    expect(component.registerForm.get('Password')).toBeDefined();
    expect(component.registerForm.get('role')).toBeDefined();
    expect(component.registerForm.get('ConfirmPassword')).toBeDefined();
  });

  it('should mark the form as touched on form submission', () => {
    component.markFormGroupTouched(component.registerForm);
    expect(component.registerForm.touched).toBeTruthy();
  });

  it('should return the username control', () => {
    expect(component.getUsernameControl()).toEqual(component.registerForm.get('Username'));
  });

  it('should return the email control', () => {
    expect(component.getEmailControl()).toEqual(component.registerForm.get('Email'));
  });

  it('should return the password control', () => {
    expect(component.getPasswordControl()).toEqual(component.registerForm.get('Password'));
  });

  it('should return the confirm password control', () => {
    expect(component.getconfirmPasswordControl()).toEqual(component.registerForm.get('ConfirmPassword'));
  });

  it('should set formSubmitted to true and call registerUser on registerForm submission', fakeAsync(() => {
    const registerUserSpy = spyOn(TestBed.inject(AuthService), 'registerUser').and.callThrough();
    component.registerForm.setValue({
      Username: 'testuser',
      Email: 'testuser@example.com',
      Password: 'testpassword',
      role: 'testrole',
      ConfirmPassword: 'testpassword',
    });
    component.register();
    tick();
    expect(component.formSubmitted).toBeTruthy();
    expect(registerUserSpy).toHaveBeenCalled();
  }));

  it('should handle form errors on registration failure', fakeAsync(() => {
    spyOn(TestBed.inject(AuthService), 'registerUser').and.returnValue(
      throwError({ message: 'Registration failed' })
    );
    component.registerForm.setValue({
      Username: 'testuser',
      Email: 'testuser@example.com',
      Password: 'testpassword',
      role: 'testrole',
      ConfirmPassword: 'testpassword',
    });
    component.register();
    tick();
    expect(component.registrationError).toEqual('Registration failed');
  }));

  it('should handle form errors on registration failure with empty error message', fakeAsync(() => {
    spyOn(TestBed.inject(AuthService), 'registerUser').and.returnValue(throwError({}));
    component.registerForm.setValue({
      Username: 'testuser',
      Email: 'testuser@example.com',
      Password: 'testpassword',
      role: 'testrole',
      ConfirmPassword: 'testpassword',
    });
    component.register();
    tick();
    expect(component.registrationError).toEqual('Registration failed. Please try again later.');
  }));
  
  it('should navigate to home on goBack', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate');
    component.goBack();
    expect(navigateSpy).toHaveBeenCalledWith(['/home']);
  });
});
