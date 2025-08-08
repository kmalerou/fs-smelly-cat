import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  NotificationEmailParams,
  ReplyEmailParams,
  SendEmailRequest,
} from '../models';
import { ApiService } from '.';
import { EMAIL_CONFIG_TOKEN } from '../configs';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private apiService = inject(ApiService);
  private config = inject(EMAIL_CONFIG_TOKEN);

  public sendNotificationEmail(
    params: NotificationEmailParams,
  ): Observable<string> {
    const notificationBody = this.createSendEmailRequest(
      this.config.templates.notification,
      params,
    );
    return this.sendEmail(notificationBody);
  }

  public sendReplyEmail(params: ReplyEmailParams): Observable<string> {
    const replyBody = this.createSendEmailRequest(
      this.config.templates.reply,
      params,
    );
    return this.sendEmail(replyBody);
  }

  private createSendEmailRequest(
    templateId: string,
    params: ReplyEmailParams | NotificationEmailParams,
  ): SendEmailRequest {
    return {
      service_id: this.config.service_id,
      template_id: templateId,
      user_id: this.config.user_id,
      template_params: params,
    };
  }

  private sendEmail(params: SendEmailRequest): Observable<string> {
    return this.apiService.postText('email/send', params);
  }
}
