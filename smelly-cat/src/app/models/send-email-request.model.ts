import { NotificationEmailParams, ReplyEmailParams } from '.';

export interface SendEmailRequest {
  service_id: string;
  template_id: string;
  user_id: string;
  template_params?: NotificationEmailParams | ReplyEmailParams;
  accessToken?: string;
}
