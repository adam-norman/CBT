import { Injectable } from '@angular/core';
import { Customer } from '../models/Customer';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly CUSTOMER_KEY = 'customer';

  constructor() {}

    // Save Customer to localStorage
    saveCustomer(customer: Customer): void {
      localStorage.setItem(this.CUSTOMER_KEY, JSON.stringify(customer));
    }

    // Retrieve Customer from localStorage
    getCustomer(): Customer | null {
      const customerData = localStorage.getItem(this.CUSTOMER_KEY);
      console.log('Raw localStorage data:', customerData);

      return customerData ? JSON.parse(customerData) as Customer : null;
    }

    // Remove Customer from localStorage (e.g., on logout)
    removeCustomer(): void {
      localStorage.removeItem(this.CUSTOMER_KEY);
    }
}
