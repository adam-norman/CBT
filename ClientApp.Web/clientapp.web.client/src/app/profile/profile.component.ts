import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CustomerService } from '../services/customer.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  customerName!: string;
  icNumber!: string;
  customer!:any;
  constructor(private authService: AuthService,
        private accountService: CustomerService,private storageService : StorageService) {
  }

  ngOnInit(): void {
    this.customer=this.storageService.getCustomer();
    this.customerName = this.customer.customerName;

    }

}
