import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [HttpClientTestingModule, FormsModule],
      providers: [AuthService, Router],
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);

    // Simulate authentication
    spyOn(authService, 'isAuthenticated').and.returnValue(true);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call authService.login and route to home on successful login', fakeAsync(() => {
    const navigateSpy = spyOn(router, 'navigate');
    spyOn(authService, 'login').and.returnValue(of({ token: 'dummyToken', email: 'dummyEmail', userRoles: 'dummyRole' }));
    component.email = 'test@example.com';
    component.password = 'password';
    component.onSubmit();
    tick();
    expect(navigateSpy).toHaveBeenCalledWith(['/home']);
  }));

  it('should handle login error', fakeAsync(() => {
    spyOn(console, 'error');
    spyOn(authService, 'login').and.returnValue(of(null));
    component.email = 'test@example.com';
    component.password = 'wrongpassword';
    component.onSubmit();
    tick();
    expect(console.error).toHaveBeenCalledWith('Empty or null response received.');
  }));
});
