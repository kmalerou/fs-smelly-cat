import { inject, Injectable } from '@angular/core';
import { MonoTypeOperatorFunction, Observable } from 'rxjs';
import {
  NotificationEmailParams,
  ReplyEmailParams,
  SendEmailRequest,
} from '../models';
import { ApiService } from '.';

const EMAILJS_SERVICE_ID = 'service_y34kl7b';
const EMAILJS_NOTIFICATION_TEMPLATE_ID = 'template_b4ywnxk';
const EMAILJS_REPLY_TEMPLATE_ID = 'template_0k65lki';
const EMAILJS_USER_ID = 'aRW_udETEp5bKaomN';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private apiService = inject(ApiService);

  public sendNotificationEmail(
    params: NotificationEmailParams,
  ): Observable<string> {
    const notificationBody = this.createSendEmailRequest(
      EMAILJS_NOTIFICATION_TEMPLATE_ID,
      params,
    );
    return this.sendEmail(notificationBody);
  }

  public sendReplyEmail(params: ReplyEmailParams): Observable<string> {
    const replyBody = this.createSendEmailRequest(
      EMAILJS_REPLY_TEMPLATE_ID,
      params,
    );
    return this.sendEmail(replyBody);
  }

  private createSendEmailRequest(
    templateId: string,
    params: ReplyEmailParams | NotificationEmailParams,
  ): SendEmailRequest {
    return {
      service_id: EMAILJS_SERVICE_ID,
      template_id: templateId,
      user_id: EMAILJS_USER_ID,
      template_params: params,
    };
  }

  private sendEmail(params: SendEmailRequest): Observable<string> {
    return this.apiService.postText('email/send', params);
  }
}
