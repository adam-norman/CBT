import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VerifyOtpRequest } from '../models/verifyOtpRequest';
import { VerifyOtpResponse } from '../models/verifyOtpResponse';
@Injectable({ providedIn: 'root' })
export class CustomerService {
  private apiUrl = 'http://localhost:5000/api/customers';

  constructor(private http: HttpClient) {}

  registerCustomer(customer: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, customer);
  }
  loginCustomer(loginDto: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, loginDto);
  }
  verifyOtp(otpData: VerifyOtpRequest): Observable<VerifyOtpResponse> {
    console.log('otpData:', otpData);
    return this.http.post<VerifyOtpResponse>(`${this.apiUrl}/verify-otp`, otpData);
  }

  setPinBiometrics(pinData: any): Observable<any> {
    console.log('pinData:', pinData);
    return this.http.post(`${this.apiUrl}/set-pin-biometrics`, pinData);
  }

  getAllCustomers(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }
  getContacts(icNumber: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/contacts`, {
      params: new HttpParams().set('icNumber', icNumber)
    });
  }
  getProfile(ICNumber: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`, {
      params: new HttpParams().set('icNumber', ICNumber)
    });
  }
}
