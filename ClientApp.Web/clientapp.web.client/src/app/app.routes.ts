import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { VerifyOtpComponent } from './verify-otp/verify-otp.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { PinCodeComponent } from './pin-code/pin-code.component';

export const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'verify-otp', component: VerifyOtpComponent },
  { path: 'pin-code', component: PinCodeComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'customers', component: CustomerListComponent },
  { path: 'profile', component: ProfileComponent  },
  { path: 'home', component: HomeComponent  },
  { path: 'login', component: LoginComponent  },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];
