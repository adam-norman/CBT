import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  constructor(private router: Router) {}
  ngOnInit(): void {
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 5000); // Redirect after 5 seconds
  }
  // Handle click event
  redirectToLogin() {
    this.router.navigate(['/login']);
  }
}
