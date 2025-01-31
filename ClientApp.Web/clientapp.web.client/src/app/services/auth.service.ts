import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private icNumber: string = '';
  private otpMedia: number = 1;

  setICNumber(phone: string) {
    this.icNumber = phone;
  }

  getICNumber(): string {
    return this.icNumber;
  }
  setOtpMedia(otpMedia: number) {
    this.otpMedia = otpMedia;
  }

  getOtpMedia(): number {
    return this.otpMedia;
  }
}
