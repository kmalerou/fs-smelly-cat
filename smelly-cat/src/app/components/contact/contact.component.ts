import { Component } from '@angular/core';
import { ContactUsFormComponent } from './contact-us-form/contact-us-form.component';
import { ContactUsMapComponent } from './contact-us-map/contact-us-map.component';

@Component({
  selector: 'app-contact',
  imports: [ContactUsFormComponent, ContactUsMapComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent {}
