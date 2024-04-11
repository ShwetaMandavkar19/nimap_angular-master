import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { ServerService } from '../services/server.service';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { MatChipInputEvent } from '@angular/material/chips';
import { ENTER, COMMA } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private ss: ServerService,
    private router: Router,
    private dialogRef: MatDialogRef<RegisterComponent>
  ) {}

  data!: FormGroup;

  // Countries
  countries = ['India', 'USA', 'UAE'];
  // States
  states: { [key: string]: string[] } = {
    India: ['Maharashtra', 'Delhi', 'Bangalore'],
    USA: ['California', 'New York', 'Texas'],
    UAE: ['Dubai', 'Abu Dhabi', 'Sharjah'],
  };

  ngOnInit(): void {
    this.data = this.fb.group({
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
      country: ['Select Country'],
      state: [],
      addressType: [],
      address1: [],
      address2: [],
      companyAddress1: [],
      companyAddress2: [],
      interests: [this.interests],
      newsletter: [false],
    });
  }

  // Function to handle file selection for image upload
  urllink: string = '';
  invalidDimensions: boolean = false;

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const img = new Image();
      img.src = window.URL.createObjectURL(file);
      img.onload = () => {
        if (img.width === 310 && img.height === 325) {
          this.invalidDimensions = false;
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = (event: any) => {
            this.urllink = event.target.result;
            // Check if the 'img' form control exists before setting its value
            const imgFormControl = this.data.get('img');
            if (imgFormControl) {
              imgFormControl.setValue(this.urllink);
            }
          };
        } else {
          alert('Image dimensions must be 310x325 px.');
          // Check if the 'img' form control exists before setting its value
          const imgFormControl = this.data.get('img');
          if (imgFormControl) {
            imgFormControl.setValue('');
          }
        }
      };
    }
  }

  //firstname

  onFirstNameInput(event: any) {
    let input = event.target.value;

    // Remove digits, special characters, and spaces
    input = input.replace(/[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g, '');

    // Ensure the length is not more than 20 characters
    if (input.length > 20) {
      input = input.slice(0, 20);
    }

    event.target.value = input;
  }
  //lastname
  onLastNameInput(event: any) {
    let input = event.target.value;

    // Remove digits, special characters, and spaces
    input = input.replace(/[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g, '');

    // Ensure the length is not more than 20 characters
    if (input.length > 20) {
      input = input.slice(0, 20);
    }

    event.target.value = input;
  }

  onMobileInput(event: any) {
    let input = event.target.value.replace(/\D/g, ''); // Remove non-numeric characters

    // Ensure number starts with 9 and has exactly 10 digits
    if (input.startsWith('9') && input.length <= 10) {
      event.target.value = input.slice(0, 10);
    } else {
      // If input is invalid, clear the input
      event.target.value = '';
    }

    // If the first digit entered is not 9, display a message
    if (input.length > 0 && input.charAt(0) !== '9') {
      // Display an error message
      const errorMessage = "Mobile number must start with '9'.";
      const errorDiv = event.target.parentNode.querySelector('.text-danger');
      if (errorDiv) {
        errorDiv.textContent = errorMessage;
      } else {
        // If the error message container doesn't exist, create one and append the error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'text-danger';
        errorDiv.textContent = errorMessage;
        event.target.parentNode.appendChild(errorDiv);
      }
    } else {
      // If the first digit entered is 9, remove any existing error message
      const errorDiv = event.target.parentNode.querySelector('.text-danger');
      if (errorDiv) {
        errorDiv.remove();
      }
    }
  }

  // Age
  formatLabel(value: number): string {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }
    return `${value}`;
  }

  // Function to handle country change event
  onChangeCountry(event: Event): void {
    const selectedCountry = (event.target as HTMLSelectElement).value;
    if (selectedCountry) {
      this.data.get('state')?.reset();
    }
  }

  // Function to check if "Home" address type is selected
  isHomeAddressSelected(): boolean {
    return this.data.get('addressType')?.value === 'home';
  }

  // Function to check if "Company" address type is selected
  isCompanyAddressSelected(): boolean {
    return this.data.get('addressType')?.value === 'company';
  }

  isHomeAddress: boolean = true;
  isCompanyAddress: boolean = false;
  onAddressTypeChange(event: Event) {
    const addressTypeControl = this.data.get('addressType');
    if (addressTypeControl) {
      addressTypeControl.valueChanges.subscribe((value: string) => {
        if (value === 'home') {
          this.isHomeAddress = true;
          this.isCompanyAddress = false;
        } else if (value === 'company') {
          this.isHomeAddress = false;
          this.isCompanyAddress = true;
        }
      });
    }
  }

  //Handled Interest Feilds
  interests: string[] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  addOnBlur = true;

  addInterest(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.interests.push(value);
    }
    event.input.value = '';
  }

  removeInterest(interest: string): void {
    const index = this.interests.indexOf(interest);
    if (index !== -1) {
      this.interests.splice(index, 1);
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  showError: boolean = false;

  // Send Data To Profile With ID
  onSubmit() {
    if (this.data.valid) {
      // Set newsletter value to true if it's selected
      this.data.patchValue({
        newsletter: this.data.value.newsletter === true,
      });

      // Save user data to the server using ServerService
      this.ss.addUser(this.data.value).subscribe(
        (response) => {
          console.log('User data saved successfully:', response);
          // Extract the user ID from the response
          const userId = response.id;

          // Redirect to profile page along with user ID
          this.router.navigateByUrl(`/profile/${userId}`);

          // Close the dialog box
          this.closeDialog();
        },
        (error) => {
          console.error('Error saving user data:', error);
          // Handle error as needed
        }
      );
    } else {
      this.data.markAllAsTouched();
      this.showError = true;
    }
  }
}
