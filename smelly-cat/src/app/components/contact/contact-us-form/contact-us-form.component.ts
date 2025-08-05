import { Component, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { hasAcceptedValidator } from '../../../validators';
import { EmailService } from '../../../services';
import { catchError, EMPTY, Observable, switchMap, take } from 'rxjs';
import { NotificationEmailParams, ReplyEmailParams } from '../../../models';

const SUCCESSFUL_EMAIL_SENT_MSG = 'Message successfully sent!';

@Component({
  selector: 'app-contact-us-form',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatCheckboxModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './contact-us-form.component.html',
  styleUrl: './contact-us-form.component.scss',
})
export class ContactUsFormComponent {
  public isSubmitting = false;
  private _emailService = inject(EmailService);
  private _snackBar = inject(MatSnackBar);

  contactForm = new FormGroup({
    fullName: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    city: new FormControl('', Validators.required),
    postalCode: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    message: new FormControl(''),
    hasAcceptedTermsAndConditions: new FormControl(false, [
      hasAcceptedValidator(),
    ]),
  });

  onSubmit() {
    this.isSubmitting = true;
    this.contactForm.disable();
    this.sendNotificationAndReplyEmails();
  }

  private createAutoReplyEmailParams(): ReplyEmailParams {
    const contactFormValue = this.contactForm.value;
    return {
      name: contactFormValue.fullName!,
      email: contactFormValue.email!,
    };
  }

  private sendAutoReplyEmail(): Observable<string> {
    const params = this.createAutoReplyEmailParams();
    return this._emailService.sendReplyEmail(params).pipe(
      take(1),
      catchError((err) => {
        this.contactForm.enable();
        console.warn('Auto reply email failed:', err);
        return EMPTY;
      }),
    );
  }

  private createNotificationEmailParams(): NotificationEmailParams {
    const contactFormValue = this.contactForm.value;
    return {
      name: contactFormValue.fullName!,
      email: contactFormValue.email!,
      dateTimeSent: new Date().toLocaleString(),
      address: contactFormValue.address!,
      zip: contactFormValue.postalCode!,
      city: contactFormValue.city!,
      message: contactFormValue.message ?? '',
    };
  }

  private sendNotificationAndReplyEmails(): void {
    const params = this.createNotificationEmailParams();
    this._emailService
      .sendNotificationEmail(params)
      .pipe(
        take(1),
        catchError((err) => {
          console.warn('Notification email failed:', err);
          return EMPTY;
        }),
        switchMap(() => this.sendAutoReplyEmail()),
      )
      .subscribe(() => {
        this.isSubmitting = false;
        this.contactForm.enable();
        this.contactForm.reset();
        this._snackBar.open(SUCCESSFUL_EMAIL_SENT_MSG, 'Close');
      });
  }
}
