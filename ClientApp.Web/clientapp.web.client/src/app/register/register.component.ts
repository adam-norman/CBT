import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { CustomerService } from '../services/customer.service'; // Adjust the path as necessary
import { UserExistsDialogComponent } from '../user-exists-dialog/user-exists-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  createAccountForm!: FormGroup;
  addressForm!: FormGroup;
  paymentForm!: FormGroup;
  currentStep = 1;
  readonly finalStep = 4;
  isNextDisabled = false;
  headers: string[] = [
    "Create Account",
    "Privacy Policy",
    "Create PIN",
    " "
  ];
  isLinear = false;
  constructor(private router: Router,
    private fb: FormBuilder,
    private accountService: CustomerService,
    private dialog: MatDialog,
    private authService: AuthService,
  ){
    this.createAccountForm = this.fb.group({
      customerName: ['', Validators.required],
      iCNumber: ['', [
        Validators.required,
        Validators.minLength(12),
        Validators.maxLength(12),
        Validators.pattern(/^[0-9]*$/)
      ]],
      mobileNumber: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{8,10}$/) // Malaysian mobile number pattern (without country code)
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]]
    });
  }

  ngOnInit(): void {
    this.currentStep = 1;
    this.isNextDisabled = false;
  }

  nextClicked() {
    if(this.currentStep == this.finalStep){
      this.router.navigate(['/profile']);
    }
    if (this.currentStep < this.finalStep) {
      this.currentStep++;
    }
  }
  get currentHeader(): string {
    return this.headers[this.currentStep-1] || " ";
  }
  // Submit each form separately and go to the next step
  submitStep(step: number) {
    let form: FormGroup=this.createAccountForm;
    if (form.valid) {
      this.accountService.registerCustomer(form.value).subscribe(res=>{
        if(res.status == 'success'){
          this.authService.setOtpMedia(res.data.otpMedia);
        }
        this.authService.setICNumber(form.value.iCNumber);
        this.router.navigate(['/verify-otp']);
        },
        error => {
          if (error.status === 409) { // HTTP 409 Conflict (User already exists)
            this.openUserExistsDialog(form.value.icNumber);
          }}
       ,()=>{} );
    } else {
      form.markAllAsTouched();
    }
  }
  openUserExistsDialog(icNumber: string) {
    this.dialog.open(UserExistsDialogComponent, {
      width: '400px',
      data: { icNumber }
    });
  }
}
