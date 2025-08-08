import { TestBed } from '@angular/core/testing';

import { EmailService } from './email.service';
import { ApiService } from '.';
import {
  NotificationEmailParams,
  ReplyEmailParams,
  SendEmailRequest,
} from '../models';
import { of, throwError } from 'rxjs';
import { EMAIL_CONFIG_TOKEN, EmailConfig } from '../configs';

describe('EmailService', () => {
  let service: EmailService;
  let apiSpy: jasmine.SpyObj<ApiService>;
  let mockEmailConfig: EmailConfig;
  const EMAILJS_SERVICE_ID = 'service_id';
  const EMAILJS_USER_ID = 'user_id';
  const EMAILJS_NOTIFICATION_TEMPLATE_ID = 'notification_template_id';
  const EMAILJS_REPLY_TEMPLATE_ID = 'reply_template_id';

  const urlPath = 'email/send';

  beforeEach(() => {
    apiSpy = jasmine.createSpyObj('ApiService', ['postText']);

    mockEmailConfig = {
      service_id: EMAILJS_SERVICE_ID,
      user_id: EMAILJS_USER_ID,
      templates: {
        notification: EMAILJS_NOTIFICATION_TEMPLATE_ID,
        reply: EMAILJS_REPLY_TEMPLATE_ID,
      },
    };
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ApiService,
          useValue: apiSpy,
        },
        { provide: EMAIL_CONFIG_TOKEN, useValue: mockEmailConfig },
      ],
    });
    service = TestBed.inject(EmailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#sendNotificationEmail()', () => {
    const templateParams: NotificationEmailParams = {
      name: 'Test name',
      email: 'email@test.com',
      dateTimeSent: 'string',
      address: 'Test address',
      zip: '12345',
      city: 'City name',
      message: 'Test message',
    };

    let payload: SendEmailRequest;

    beforeEach(() => {
      payload = {
        service_id: mockEmailConfig.service_id,
        template_id: mockEmailConfig.templates.notification,
        user_id: mockEmailConfig.user_id,
        template_params: templateParams,
      };
    });

    it('should call postText() api and return string', () => {
      const response = 'OK';
      apiSpy.postText.and.returnValue(of(response));

      service.sendNotificationEmail(templateParams).subscribe((res) => {
        expect(res).toBe(response);
      });

      expect(apiSpy.postText).toHaveBeenCalledOnceWith(urlPath, payload);
    });

    it('should propagate error if postText() api fails', () => {
      const error = new Error('API failed');
      apiSpy.postText.and.returnValue(throwError(() => error));

      service.sendNotificationEmail(templateParams).subscribe({
        next: () =>
          fail(
            'Expected an error from sendNotificationEmail() request, but got a successful response',
          ),
        error: (err) => {
          expect(err).toBe(error);
        },
      });
    });
  });

  describe('#sendReplyEmail()', () => {
    const templateParams: ReplyEmailParams = {
      name: 'Test name',
      email: 'email@test.com',
    };

    let payload: SendEmailRequest;

    beforeEach(() => {
      payload = {
        service_id: mockEmailConfig.service_id,
        template_id: mockEmailConfig.templates.reply,
        user_id: mockEmailConfig.user_id,
        template_params: templateParams,
      };
    });

    it('should call postText() api and return string', () => {
      const response = 'OK';
      apiSpy.postText.and.returnValue(of(response));

      service.sendReplyEmail(templateParams).subscribe((res) => {
        expect(res).toBe(response);
      });

      expect(apiSpy.postText).toHaveBeenCalledOnceWith(urlPath, payload);
    });

    it('should propagate error if postText() api fails', () => {
      const error = new Error('API failed');
      apiSpy.postText.and.returnValue(throwError(() => error));

      service.sendReplyEmail(templateParams).subscribe({
        next: () =>
          fail(
            'Expected an error from sendReplyEmail() request, but got a successful response',
          ),
        error: (err) => {
          expect(err).toBe(error);
        },
      });
    });
  });
});
