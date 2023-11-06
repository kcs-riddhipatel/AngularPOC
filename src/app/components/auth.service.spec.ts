import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return roles from getRoles', () => {
    const apiUrl = service.apiUrl;
    const mockRoles = ['role1', 'role2'];
    service.getRoles().subscribe((roles) => {
      expect(roles).toEqual(mockRoles);
    });

    const req = httpTestingController.expectOne(`${apiUrl}/getRoles`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockRoles);
  });

  it('should handle login and store token in localStorage', () => {
    const mockResponse = { token: 'testToken', email: 'test@example.com', userRoles: 'role1' };
    const mockLoginData = { Email: 'test@example.com', Password: 'password123' };

    service.login(mockLoginData.Email, mockLoginData.Password).subscribe((response) => {
      expect(response).toEqual(mockResponse);
      expect(localStorage.getItem('access_token')).toEqual('testToken');
      expect(localStorage.getItem('email')).toEqual('test@example.com');
      expect(localStorage.getItem('role')).toEqual('role1');
    });

    const req = httpTestingController.expectOne(`${service.apiUrl}/login`);
    expect(req.request.method).toEqual('POST');
    req.flush(mockResponse);
  });

  it('should handle login error and show alert', () => {
    const mockLoginData = { Email: 'test@example.com', Password: 'password123' };
    spyOn(window, 'alert');

    service.login(mockLoginData.Email, 'wrongPassword').subscribe(
      () => {},
      (error) => {
        expect(error).toBeTruthy();
        expect(window.alert).toHaveBeenCalledWith('Invalid username & password');
      }
    );

    const req = httpTestingController.expectOne(`${service.apiUrl}/login`);
    expect(req.request.method).toEqual('POST');
    req.error(new ErrorEvent('Invalid password'));
  });

  afterEach(() => {
    httpTestingController.verify();
  });
});

