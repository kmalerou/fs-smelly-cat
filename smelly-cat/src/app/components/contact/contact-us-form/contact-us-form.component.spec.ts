import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { ContactUsFormComponent } from './contact-us-form.component';
import { EMAIL_CONFIG_TOKEN, EmailConfig } from '../../../configs';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { EmailService, SnackbarService } from '../../../services';
import { NEVER, of, throwError } from 'rxjs';

describe('ContactUsFormComponent', () => {
  let component: ContactUsFormComponent;
  let emailServiceSpy: jasmine.SpyObj<EmailService>;
  let snackBarSpy: jasmine.SpyObj<SnackbarService>;
  let fixture: ComponentFixture<ContactUsFormComponent>;
  let mockEmailConfig: EmailConfig;
  const EMAILJS_SERVICE_ID = 'service_id';
  const EMAILJS_USER_ID = 'user_id';
  const EMAILJS_NOTIFICATION_TEMPLATE_ID = 'notification_template_id';
  const EMAILJS_REPLY_TEMPLATE_ID = 'reply_template_id';

  const validFormFill = {
    fullName: 'John Doe',
    email: 'test@mail.com',
    city: 'A city',
    postalCode: '12345',
    address: '123 Street',
    message: 'Test message',
    hasAcceptedTermsAndConditions: true,
  };

  beforeEach(async () => {
    emailServiceSpy = jasmine.createSpyObj('EmailService', [
      'sendNotificationEmail',
      'sendReplyEmail',
    ]);
    snackBarSpy = jasmine.createSpyObj('SnackbarService', [
      'openDefaultSnackbar',
    ]);
    mockEmailConfig = {
      service_id: EMAILJS_SERVICE_ID,
      user_id: EMAILJS_USER_ID,
      templates: {
        notification: EMAILJS_NOTIFICATION_TEMPLATE_ID,
        reply: EMAILJS_REPLY_TEMPLATE_ID,
      },
    };
    await TestBed.configureTestingModule({
      imports: [ContactUsFormComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: EMAIL_CONFIG_TOKEN, useValue: mockEmailConfig },
        {
          provide: EmailService,
          useValue: emailServiceSpy,
        },
        {
          provide: SnackbarService,
          useValue: snackBarSpy,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactUsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the contact form on component init', () => {
    expect(component.contactForm).toBeTruthy();
    expect(component.contactForm instanceof FormGroup).toBeTrue();
  });

  it('should call onSubmit when submit button is clicked', () => {
    spyOn(component, 'onSubmit');
    component.contactForm.setValue(validFormFill);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector(
      'button[type="submit"]',
    )!;
    button.click();

    expect(component.onSubmit).toHaveBeenCalled();
  });

  describe('contact form validation', () => {
    it('should validate fullName field: required and containg only spaces and alphanumerics', () => {
      const control = component.contactForm.get('fullName')!;
      control.setValue('');
      expect(control.hasError('required'))
        .withContext('should fail when fullName is empty')
        .toBeTrue();

      control.setValue('John1234');
      expect(control.hasError('pattern'))
        .withContext('should fail when fullName has numbers')
        .toBeTrue();

      control.setValue('John Doe');
      expect(control.valid)
        .withContext(
          'should pass when fullName has value and contains spaces and alphanumerics',
        )
        .toBeTrue();
    });

    it('should validate email field: required and email pattern', () => {
      const control = component.contactForm.get('email')!;
      control.setValue('');
      expect(control.hasError('required'))
        .withContext('should fail when email is empty')
        .toBeTrue();

      control.setValue('test');
      expect(control.hasError('email'))
        .withContext('should fail when email is not a valid email')
        .toBeTrue();

      control.setValue('test@mail.com');
      expect(control.valid)
        .withContext('should pass when email has value and is a valid email')
        .toBeTrue();
    });
    it('should validate city field: required', () => {
      const control = component.contactForm.get('city')!;
      control.setValue('');
      expect(control.hasError('required'))
        .withContext('should fail when city is empty')
        .toBeTrue();

      control.setValue('Test city');
      expect(control.valid)
        .withContext('should pass when city has value')
        .toBeTrue();
    });

    it('should validate postalCode field: required', () => {
      const control = component.contactForm.get('postalCode')!;
      control.setValue('');
      expect(control.hasError('required'))
        .withContext('should fail when postalCode is empty')
        .toBeTrue();

      control.setValue('Test postal code');
      expect(control.valid)
        .withContext('should pass when postalCode has value')
        .toBeTrue();
    });

    it('should validate address field: required', () => {
      const control = component.contactForm.get('address')!;
      control.setValue('');
      expect(control.hasError('required'))
        .withContext('should fail when address is empty')
        .toBeTrue();

      control.setValue('Test address');
      expect(control.valid)
        .withContext('should pass when address has value')
        .toBeTrue();
    });

    it('should allow message field to be optional', () => {
      const control = component.contactForm.get('message')!;
      control.setValue('');
      expect(control.valid)
        .withContext('should pass when message is empty')
        .toBeTrue();
    });

    it('should validate hasAcceptedTermsAndConditions field: hasAcceptedValidator()', () => {
      const control = component.contactForm.get(
        'hasAcceptedTermsAndConditions',
      )!;
      control.setValue(false);
      expect(control.hasError('hasNotAccepted'))
        .withContext('should fail when hasAcceptedTermsAndConditions is false')
        .toBeTrue();

      control.setValue(true);
      expect(control.valid)
        .withContext('should pass when hasAcceptedTermsAndConditions is true')
        .toBeTrue();
    });

    it('should disable submit button when form is invalid', () => {
      component.contactForm.reset();
      fixture.detectChanges();

      const button: HTMLButtonElement = fixture.nativeElement.querySelector(
        'button[type="submit"]',
      )!;
      expect(button.disabled).toBeTrue();
    });

    it('should enable submit button when form is valid', () => {
      component.contactForm.setValue(validFormFill);
      fixture.detectChanges();

      const button: HTMLButtonElement = fixture.nativeElement.querySelector(
        'button[type="submit"]',
      )!;
      expect(button.disabled).toBeFalse();
    });
  });

  describe('contact form submission', () => {
    it('should show spinner when submit button is clicked', () => {
      emailServiceSpy.sendNotificationEmail.and.returnValue(NEVER);
      emailServiceSpy.sendReplyEmail.and.returnValue(NEVER);
      component.contactForm.setValue(validFormFill);
      spyOn(component, 'onSubmit').and.callThrough();

      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector(
        'button[type="submit"]',
      )!;
      button.click();
      fixture.detectChanges();

      const spinner = fixture.nativeElement.querySelector('mat-spinner');
      expect(spinner).toBeTruthy();

      const label = fixture.nativeElement.querySelector(
        '.contact-form__submit-button-label',
      );
      expect(label).toBeFalsy();
    });

    it('should disable the form when submit button is clicked', () => {
      const response = 'OK';
      emailServiceSpy.sendNotificationEmail.and.returnValue(NEVER);
      emailServiceSpy.sendReplyEmail.and.returnValue(NEVER);
      component.contactForm.setValue(validFormFill);
      spyOn(component, 'onSubmit').and.callThrough();

      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector(
        'button[type="submit"]',
      )!;
      button.click();
      fixture.detectChanges();
      expect(component.contactForm.disabled).toBeTrue();
    });

    it('should send notification and auto-reply emails and show success snackbar on successful form submit', fakeAsync(() => {
      const response = 'OK';
      emailServiceSpy.sendNotificationEmail.and.returnValue(of(response));
      emailServiceSpy.sendReplyEmail.and.returnValue(of(response));
      snackBarSpy.openDefaultSnackbar;

      component.contactForm.setValue(validFormFill);
      spyOn(component, 'onSubmit').and.callThrough();
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector(
        'button[type="submit"]',
      )!;
      button.click();
      tick();
      fixture.detectChanges();
      expect(emailServiceSpy.sendNotificationEmail).toHaveBeenCalledWith(
        jasmine.objectContaining({
          name: validFormFill.fullName,
          email: validFormFill.email,
          address: validFormFill.address,
          zip: validFormFill.postalCode,
          city: validFormFill.city,
          message: validFormFill.message,
          dateTimeSent: jasmine.any(String),
        }),
      );
      expect(emailServiceSpy.sendReplyEmail).toHaveBeenCalledWith(
        jasmine.objectContaining({
          name: validFormFill.fullName,
          email: validFormFill.email,
        }),
      );
      expect(snackBarSpy.openDefaultSnackbar).toHaveBeenCalledWith(
        'Message successfully sent!',
      );
      expect(component.isSubmitting).toBeFalse();
      expect(component.contactForm.enabled).toBeTrue();
    }));

    it('should show fail snackbar when send notification fails', fakeAsync(() => {
      spyOn(console, 'warn').and.stub();
      const error = new Error('API failed');
      emailServiceSpy.sendNotificationEmail.and.returnValue(
        throwError(() => error),
      );
      emailServiceSpy.sendReplyEmail.and.returnValue(of('OK'));
      snackBarSpy.openDefaultSnackbar;

      component.contactForm.setValue(validFormFill);
      spyOn(component, 'onSubmit').and.callThrough();
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector(
        'button[type="submit"]',
      )!;
      button.click();
      tick();
      fixture.detectChanges();

      expect(emailServiceSpy.sendReplyEmail).not.toHaveBeenCalled();
      expect(snackBarSpy.openDefaultSnackbar).toHaveBeenCalledWith(
        'Failed to send email. Please try again later.',
      );
      expect(component.contactForm.enabled).toBeTrue();
    }));

    it('should still show success snackbar when send auto-reply fails after notification success', fakeAsync(() => {
      spyOn(console, 'warn').and.stub();
      const response = 'OK';
      emailServiceSpy.sendNotificationEmail.and.returnValue(of(response));
      const error = new Error('API failed');
      emailServiceSpy.sendReplyEmail.and.returnValue(throwError(() => error));

      snackBarSpy.openDefaultSnackbar;

      component.contactForm.setValue(validFormFill);
      spyOn(component, 'onSubmit').and.callThrough();
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector(
        'button[type="submit"]',
      )!;
      button.click();
      tick();
      fixture.detectChanges();

      expect(emailServiceSpy.sendNotificationEmail).toHaveBeenCalledWith(
        jasmine.objectContaining({
          name: validFormFill.fullName,
          email: validFormFill.email,
          address: validFormFill.address,
          zip: validFormFill.postalCode,
          city: validFormFill.city,
          message: validFormFill.message,
          dateTimeSent: jasmine.any(String),
        }),
      );
      expect(emailServiceSpy.sendReplyEmail).toHaveBeenCalledWith(
        jasmine.objectContaining({
          name: validFormFill.fullName,
          email: validFormFill.email,
        }),
      );
      expect(snackBarSpy.openDefaultSnackbar).toHaveBeenCalledWith(
        'Message successfully sent!',
      );
      expect(component.isSubmitting).toBeFalse();
      expect(component.contactForm.enabled).toBeTrue();
    }));
  });
});
