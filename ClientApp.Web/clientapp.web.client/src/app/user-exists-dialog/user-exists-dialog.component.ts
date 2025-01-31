import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button'; // Required for Material Buttons

@Component({
  selector: 'app-user-exists-dialog',
  imports: [ MatDialogModule,
    MatButtonModule ],
  templateUrl: './user-exists-dialog.component.html',
  styleUrl: './user-exists-dialog.component.css'
})
export class UserExistsDialogComponent {
  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<UserExistsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  goToLogin() {
    this.dialogRef.close();
    this.router.navigate(['/login']);
  }

  retryRegistration() {
    this.dialogRef.close();
    this.router.navigate(['/register']);
  }
}
