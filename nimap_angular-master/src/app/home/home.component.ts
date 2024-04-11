import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  @ViewChild('registerButton') registerButton!: ElementRef;

  constructor(private dialog: MatDialog) {}

  openRegistrationDialog() {
    const dialogConfig = {
      autoFocus: false,
      width: '500px',
      position: {
        top: '20px',
      },
      maxHeight: '550px',
      overflowY: 'auto',
    };
    this.dialog.open(RegisterComponent, dialogConfig);
  }
}
