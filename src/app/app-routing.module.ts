import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegistrationComponent } from './components/auth/registration/registration.component';
import { authGuard } from './components/auth.guard';
import { HomeComponent } from './components/User/home/home.component';
import { HeaderComponent } from './components/shared/header/header.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { UserListComponent } from './components/User/user-list/user-list.component';

const routes: Routes = [  
  { path: 'login', component: LoginComponent } , 
  { path: 'registration', component: RegistrationComponent ,canActivate: [authGuard]},
  { path: 'header', component: HeaderComponent ,canActivate: [authGuard]},
  { path: 'footer', component: FooterComponent ,canActivate: [authGuard]},
  { path: 'home', component: HomeComponent ,canActivate: [authGuard]},
  { path: 'user', component: UserListComponent ,canActivate: [authGuard]},
  { path: '', redirectTo: '/home', pathMatch: 'full', }];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
