import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  email: string | null = null;
  role: string | null = null;
  isAdmin = false;

  constructor(private router: Router, public authService: AuthService) {}

  ngOnInit() {
    this.authService.getRoles().subscribe((data: string[]) => {
      if (data.includes('Admin')) {
        this.isAdmin = true;
      }
    });

    this.email = this.authService.getUsername();
    this.role = this.authService.getUserRoleName();
  }

  homepage() {
    this.router.navigate(['/home']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
