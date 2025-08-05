import { Component, inject, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { hasAcceptedValidator } from '../../../validators';
import { EmailService, SnackbarService } from '../../../services';
import { catchError, EMPTY, Observable, switchMap, take } from 'rxjs';
import { NotificationEmailParams, ReplyEmailParams } from '../../../models';

const SUCCESSFUL_EMAIL_SENT_MSG = 'Message successfully sent!';
const FAILED_EMAIL_SENT_MSG = 'Failed to send email. Please try again later.';

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
  @ViewChild('formDirective') private formDirective!: FormGroupDirective;
  public isSubmitting = false;
  public contactForm!: FormGroup;

  private _fb = inject(FormBuilder);
  private _emailService = inject(EmailService);
  private _snackbarService = inject(SnackbarService);

  private readonly _initialFormState = {
    fullName: '',
    email: '',
    city: '',
    postalCode: '',
    address: '',
    message: '',
    hasAcceptedTermsAndConditions: false,
  };

  ngOnInit(): void {
    this.initializeForm();
  }

  onSubmit() {
    this.isSubmitting = true;
    this.contactForm.disable();
    this.sendNotificationAndReplyEmails();
  }

  private initializeForm(): void {
    this.contactForm = this._fb.group({
      fullName: new FormControl(this._initialFormState.fullName, [
        Validators.required,
        Validators.pattern('[a-zA-Z ]*'),
      ]),
      email: new FormControl(this._initialFormState.email, [
        Validators.required,
        Validators.email,
      ]),
      city: new FormControl(this._initialFormState.city, Validators.required),
      postalCode: new FormControl(
        this._initialFormState.postalCode,
        Validators.required,
      ),
      address: new FormControl(
        this._initialFormState.address,
        Validators.required,
      ),
      message: new FormControl(this._initialFormState.message),
      hasAcceptedTermsAndConditions: new FormControl(
        this._initialFormState.hasAcceptedTermsAndConditions,
        [hasAcceptedValidator()],
      ),
    });
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

  private handleSendNotificationEmailSuccess(): void {
    this.isSubmitting = false;
    this.formDirective.resetForm();
    this.contactForm.reset({ ...this._initialFormState });
    this.contactForm.enable();
    this._snackbarService.openDefaultSnackbar(SUCCESSFUL_EMAIL_SENT_MSG);
  }

  private handleSendNotificationEmailFailure(): void {
    this.contactForm.enable();
    this._snackbarService.openDefaultSnackbar(FAILED_EMAIL_SENT_MSG);
  }

  private sendNotificationAndReplyEmails(): void {
    const params = this.createNotificationEmailParams();
    this._emailService
      .sendNotificationEmail(params)
      .pipe(
        take(1),
        catchError((err) => {
          console.warn('Notification email failed:', err);
          this.handleSendNotificationEmailFailure();
          return EMPTY;
        }),
        switchMap(() => this.sendAutoReplyEmail()),
      )
      .subscribe(() => {
        this.handleSendNotificationEmailSuccess();
      });
  }
}
