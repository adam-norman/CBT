import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CustomerService } from '../services/customer.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { StorageService } from '../services/storage.service';
@Component({
  selector: 'app-pin-code',
  imports: [FormsModule, CommonModule],
  templateUrl: './pin-code.component.html',
  styleUrl: './pin-code.component.css'
})
export class PinCodeComponent implements OnInit {
  @ViewChild('otpInput') otpInput!: ElementRef; // Reference to OTP input
  firstTryCompleted = false;
  firstTryPinCode!: string;
  secondTryPinCode!: string;
  secondTryCompleted = false;
  headers: string[] = [
    "Create Account",
    "Privacy Policy",
    "Create PIN",
    " "
  ];
  icNumber!: string;
  otpMedia!: number;
  innerTitle: string = "Create";
  readonly PIN_CODE_LENGTH: number = 6;
  isButtonDisabled: boolean = true;
  displayMessage: string = '';
  interval: any;
  otp: string = '';
  currentStep = 3;
  finalStep = 4;
  isActive = false;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private storageService : StorageService,
    private accountService: CustomerService,
  ) { }

  ngOnInit(): void {
    let customer=this.storageService.getCustomer();
    console.log('Customer:', JSON.stringify(customer, null, 2));
    if (customer) {
      this.icNumber = customer.icNumber;
    }
    if (this.icNumber != null) {

      this.accountService.getContacts(this.icNumber).subscribe(
        response => {
          console.log('User contacts:', response);

          if (this.otpMedia == 1) this.displayMessage = response.phoneNumber;
          if (this.otpMedia == 2) this.displayMessage = response.emailAddress;
        },
        error => console.error('Error:', error)
        , () => { });
    }
  }


  get currentHeader(): string {
    return this.headers[this.currentStep - 1] || " ";
  }

  appendNumber(num: string): void {
    if (this.otp.length < this.PIN_CODE_LENGTH) {
      this.otp += num;
    }
    this.validatePin();
  }
  validatePin() {
    // let input = (event.target as HTMLInputElement).value;
    if (this.innerTitle == "Create") {
      if (this.otp.length == this.PIN_CODE_LENGTH && this.firstTryCompleted == false) {
        this.firstTryCompleted = true;
        this.firstTryPinCode = this.otp;
      }
    }
    if (this.innerTitle == "Confirm") {
      if (this.otp.length == this.PIN_CODE_LENGTH && this.secondTryCompleted == false) {
        this.secondTryCompleted = true;
        this.secondTryPinCode = this.otp;
        if( this.secondTryPinCode!==this.firstTryPinCode){
          Swal.fire({
            title: 'Error!',
            text: 'PIN code does not match.',
            icon: 'error',
            confirmButtonText: 'Retry'
          });
          this.secondTryCompleted = false;
          this.otp = '';
        }
      }
    }
  }
  removeLastDigit(): void {
    this.otp = this.otp.slice(0, -1);
    if (this.innerTitle == "Confirm") {
      this.secondTryCompleted = false;
    }
    if (this.innerTitle == "Create") {
      if (this.otp.length < this.PIN_CODE_LENGTH) {
        this.firstTryCompleted = false;
      }
    }
  }
  next() {
    this.firstTryPinCode = this.otp;
    this.otp = '';
    this.innerTitle = "Confirm";
  }
  confirm(){
    this.currentStep=this.finalStep;
  }
  // Verify OTP
  submit(enabled:boolean): void {
    if(this.firstTryPinCode!==this.otp){
      Swal.fire({
        title: 'Error!',
        text: 'PIN code does not match.',
        icon: 'error',
        confirmButtonText: 'Retry'
      });
      return;
    }
   let pinBiometric={ ICNumber: this.icNumber, PIN: this.otp, EnableBiometrics:enabled };
   console.log('PinBiometric:',pinBiometric);
      this.accountService.setPinBiometrics(pinBiometric).subscribe(
        res => {
          console.log('Response:', res);
          if (res.isSuccess == true) {
            this.router.navigate(['/profile']);
          } else {
            Swal.fire({
              title: 'Error!',
              text: 'Error while setting PIN code.',
              icon: 'error',
              confirmButtonText: 'Retry'
            });
          }

        },
        err => {
          Swal.fire({
            title: 'Error!',
            text: 'Error while setting PIN code.',
            icon: 'error',
            confirmButtonText: 'Retry'
          });
        },
        () => { });
      console.log('Setting Pin Code:', this.otp);
    }

    setFocus() {
      if (this.otpInput) {
        this.otpInput.nativeElement.focus();
      }
    }
  }
