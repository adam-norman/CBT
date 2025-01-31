import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from '../services/customer.service';
import { FormBuilder,FormGroup,FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-login',
  imports: [  CommonModule,
    ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
   loginAccountForm!: FormGroup;
constructor(private router: Router,
  private fb: FormBuilder,
    private accountService: CustomerService,
    private authService: AuthService,
  ){

     this.loginAccountForm = this.fb.group({
          iCNumber: ['', [
            Validators.required,
            Validators.minLength(12),
            Validators.maxLength(12),
            Validators.pattern(/^[0-9]*$/)
          ]]
  });
}
  login(){
    this.accountService.loginCustomer(this.loginAccountForm.value).subscribe(res=>{
      console.log('User logged in successfully:', res);
      if(res.status == 'success'){
        this.authService.setOtpMedia(res.data.otpMedia);
      }
      this.authService.setICNumber(this.loginAccountForm.value.iCNumber);
      }, err=>{}, ()=>{

      this.router.navigate(['/verify-otp']);
      });
  }
}
