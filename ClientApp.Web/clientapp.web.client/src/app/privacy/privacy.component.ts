import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-privacy',
  imports: [],
  templateUrl: './privacy.component.html',
  styleUrl: './privacy.component.css'
})
export class PrivacyComponent implements OnInit {
  currentStep = 2;
  finalStep = 4;
  isNextDisabled = false;
  ICNumber!: string;
  headers: string[] = [
    "Create Account",
    "Privacy Policy",
    "Create PIN",
    " "
  ];
  constructor(private router: Router,private storageService : StorageService) {
  }
  ngOnInit(): void {
    let customer = this.storageService.getCustomer();
    if (customer) {
      this.ICNumber = customer.icNumber;
    } else {
      // Handle the case when customer is null
      this.ICNumber = '';
    }
  }
  nextClicked() {
    if(this.currentStep == 2){
      this.router.navigate(['/pin-code']);
    }
  }
  get currentHeader(): string {
    return this.headers[this.currentStep-1] || " ";
  }
}
