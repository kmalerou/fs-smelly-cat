import { Component } from '@angular/core';
import { PhoneFormatPipe } from '../../../pipes';

interface ContactInfo {
  address: string;
  zip: number;
  city: string;
  country: string;
  phone: string;
  email: string;
}

@Component({
  selector: 'app-contact-us-map',
  imports: [PhoneFormatPipe],
  templateUrl: './contact-us-map.component.html',
  styleUrl: './contact-us-map.component.scss',
})
export class ContactUsMapComponent {
  public readonly contactInfo: ContactInfo = {
    address: 'Aristotelous 16',
    zip: 54658,
    city: 'Thessaloniki',
    country: 'Greece',
    phone: '+302311290998',
    email: 'hey@smellycat.gr',
  };
}
