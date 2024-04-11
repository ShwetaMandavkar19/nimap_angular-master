// Retreive User Based On ID

import { Component, OnInit } from '@angular/core';
import { ServerService } from '../services/server.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatSliderModule } from '@angular/material/slider';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  userData: any;
  editMode: boolean = false;
  profileForm!: FormGroup; // Add ! to indicate it will be initialized later

  constructor(
    private route: ActivatedRoute,
    private ss: ServerService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm(); // Initialize the form
    // Retrieve the user ID from the route parameters
    this.route.params.subscribe((params) => {
      const userId = params['id']; // Assuming the parameter name is 'id'

      // Retrieve user data from the server based on the user ID
      this.ss.getUserWithid(userId).subscribe(
        (userData: any) => {
          this.userData = userData;
          console.log('User data received:', this.userData);
          // Set the form values with the received user data
          this.profileForm.patchValue(this.userData);
        },
        (error) => {
          console.error('Error retrieving user data:', error);
          // Handle error as needed
        }
      );
    });
  }

  // Function to initialize the form
  initializeForm(): void {
    this.profileForm = this.fb.group({
      img: ['', Validators.required],
      firstName: [
        '',
        [
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern(/^[a-zA-Z]+$/),
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern(/^[a-zA-Z]+$/),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      mobile: [
        '',
        [
          Validators.required,
          Validators.pattern('[0-9]*$'),
          Validators.maxLength(10),
        ],
      ],
      age: [],
      country: [],
      state: [],
      addressType: [],
      address1: [],
      address2: [],
      companyAddress1: [],
      companyAddress2: [],
      // interests: [],
      newsletter: [false],
    });
  }

  getUserAvatar(imageUrl: string | undefined): string {
    // If urllink has a value, return it, otherwise fall back to either imageUrl or the default avatar
    return this.urllink || imageUrl || 'assets/img/avatar.png';
  }

  // Function to handle file selection for image upload
  urllink: string = '';

  selectFiles(event: any) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = (event: any) => {
        this.urllink = event.target.result;
      };

      reader.readAsDataURL(file);
    }
  }

  // Age
  formatLabel(value: number): string {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }
    return `${value}`;
  }

  // Function to check if "Home" address type is selected
  isHomeAddressSelected(): boolean {
    return this.profileForm.get('addressType')?.value === 'home';
  }

  // Function to check if "Company" address type is selected
  isCompanyAddressSelected(): boolean {
    return this.profileForm.get('addressType')?.value === 'company';
  }

  // Function to handle address type change event
  onAddressTypeChange(event: Event): void {
    const addressType = (event.target as HTMLSelectElement).value;
    if (addressType === 'home') {
      this.profileForm.get('companyAddress1')?.reset();
      this.profileForm.get('companyAddress2')?.reset();
    } else if (addressType === 'company') {
      this.profileForm.get('address1')?.reset();
      this.profileForm.get('address2')?.reset();
    }
  }

  // Function To Handle Instant Search On  Google Maps Button
  redirectToGoogleMaps(
    address1: string,
    address2: string,
    state: string,
    country: string
  ) {
    // Construct the Google Maps URL based on the address details
    const addressQuery = `${address1},${address2},${state},${country}`;
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      addressQuery
    )}`;

    // Open the Google Maps URL in a new tab
    window.open(googleMapsUrl, '_blank');
  }

  //Function To Handle Instant Call Button
  redirectToPhoneNumber(phoneNumber: string) {
    // Construct the tel URL with the phone number
    const telUrl = `tel:${phoneNumber}`;

    // Trigger a call to the phone number
    window.open(telUrl, '_blank');
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }

  saveChanges(): void {
    // Merge the form values with userData object
    const updatedUserData = { ...this.userData, ...this.profileForm.value };
    this.ss.updateUser(this.userData.id, updatedUserData).subscribe(
      (updatedUserData: any) => {
        // Update successful
        console.log('User data updated:', updatedUserData);
        // Toggle back to view mode
        this.editMode = false;
        // Reload the current route
        this.router
          .navigateByUrl('/', { skipLocationChange: true })
          .then(() => {
            this.router.navigate(['profile', this.userData.id]);
          });
      },
      (error) => {
        console.error('Error updating user data:', error);
        // Handle error as needed
      }
    );
  }
}
