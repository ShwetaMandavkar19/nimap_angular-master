export class Users {
  id: string;
  img: File;
  firstName: string;
  lastName: string;
  email: string;
  mobile: number;
  age: string;
  state: string;
  country: string;
  addressType: string;
  address1: string;
  address2: string;
  companyAddress1: string;
  companyAddress2: string;
  interests: string;
  newsletter: boolean;

  constructor(
    id: string,
    img: File,
    firstName: string,
    lastName: string,
    email: string,
    mobile: number,
    age: string,
    state: string,
    country: string,
    addressType: string,
    address1: string,
    address2: string,
    companyAddress1: string,
    companyAddress2: string,
    interests: string,
    newsletter: boolean
  ) {
    this.id = id;
    this.img = img;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.mobile = mobile;
    this.age = age;
    this.state = state;
    this.country = country;
    this.addressType = addressType;
    this.address1 = address1;
    this.address2 = address2;
    this.companyAddress1 = companyAddress1;
    this.companyAddress2 = companyAddress2;
    this.interests = interests;
    this.newsletter = newsletter;
  }
}
