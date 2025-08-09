import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactUsMapComponent } from './contact-us-map.component';
import { PhoneFormatPipe } from '../../../pipes';

describe('ContactUsMapComponent', () => {
  let component: ContactUsMapComponent;
  let fixture: ComponentFixture<ContactUsMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactUsMapComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactUsMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render formatted phone number using PhoneFormatPipe', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const phoneLink = compiled.querySelector('a[href^="tel:"]')!;

    const pipe = new PhoneFormatPipe();
    const expectedFormatted = pipe.transform(component.contactInfo.phone);

    expect(phoneLink.textContent?.trim()).toBe(expectedFormatted);
  });
});
