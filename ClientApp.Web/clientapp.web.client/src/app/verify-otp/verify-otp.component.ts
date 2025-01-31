import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CustomerService } from '../services/customer.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { StorageService } from '../services/storage.service';
@Component({
  selector: 'app-verify-otp',
  imports: [FormsModule],
  templateUrl: './verify-otp.component.html',
  styleUrl: './verify-otp.component.css'
})
export class VerifyOtpComponent implements OnInit {
  @ViewChild('otpInput') otpInput!: ElementRef; // Reference to OTP input

  constructor(private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private accountService: CustomerService,
    private storageService : StorageService
  ) {}
  icNumber!:string;
  otpMedia!:number;
  countdown: number = 120; // 120 seconds (2 minutes) Otp expiry time in seconds
  timerDisplay: string = '2:00';
  isButtonDisabled: boolean = true;
  displayMessage: string = '';
  interval: any;
  otp: string = '';
  ngOnInit(): void {
    this.setFocus();
    this.icNumber = this.authService.getICNumber();
   this.otpMedia= this.authService.getOtpMedia();
    if(this.icNumber!=null){
      this.accountService.getContacts(this.icNumber).subscribe(
        response => {console.log('User contacts:', response);
          if(this.otpMedia==1) this.displayMessage =  response.phoneNumber;
          if(this.otpMedia==2) this.displayMessage =  response.emailAddress;
        },
        error => console.error('Error:', error)
      , () => { this.startCountdown(); });
    }
  }
  startCountdown() {
    this.isButtonDisabled = true;
    this.countdown = 120;
    this.updateTimerDisplay();

    this.interval = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
        this.updateTimerDisplay();
      } else {
        clearInterval(this.interval);
        this.isButtonDisabled = false;
      }
    }, 1000);
  }
  updateTimerDisplay() {
    const minutes = Math.floor(this.countdown / 60);
    const seconds = this.countdown % 60;
    this.timerDisplay = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  resendOtp() {
    if (!this.isButtonDisabled) {
      console.log('Resending OTP...');
      this.startCountdown(); // Restart the timer after resending OTP
    }
  }

  appendNumber(num: string): void {
    if (this.otp.length < 4) {
      this.otp += num;
    }
  }

  removeLastDigit(): void {
    this.otp = this.otp.slice(0, -1);
  }
// Verify OTP
verifyOtp(): void {
  if (this.otp.length === 4) {
   this.accountService.verifyOtp({ICNumber:this.icNumber,Otp:this.otp}).subscribe(
    res=>{
      this.storageService.saveCustomer(res.customer);
      if(res.isSuccess == true){
        this.router.navigate(['/privacy']);
      }else{

        this.otp = '';
        this.setFocus();
        Swal.fire({
          title: 'Error!',
          text: 'Invalid or Expired OTP code.',
          icon: 'error',
          confirmButtonText: 'Retry'
        });
      }

    },
    err=>{
      this.otp = '';
      this.setFocus();
      Swal.fire({
        title: 'Error!',
        text: 'Invalid or Expired OTP code.',
        icon: 'error',
        confirmButtonText: 'Retry'
      });
    },
    ()=>{});
    console.log('Verifying OTP:', this.otp);
    // Example: this.otpService.verifyOtp(this.otp);
  }
}
setFocus() {
  if (this.otpInput) {
    this.otpInput.nativeElement.focus();
  }
}
}
