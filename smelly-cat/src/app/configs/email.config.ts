import { InjectionToken } from '@angular/core';

export interface EmailConfig {
  service_id: string;
  user_id: string;
  templates: {
    notification: string;
    reply: string;
  };
}

const EMAILJS_SERVICE_ID = 'service_y34kl7b';
const EMAILJS_NOTIFICATION_TEMPLATE_ID = 'template_b4ywnxk';
const EMAILJS_REPLY_TEMPLATE_ID = 'template_0k65lki';
const EMAILJS_USER_ID = 'aRW_udETEp5bKaomN';

export const EMAIL_CONFIG: EmailConfig = {
  service_id: EMAILJS_SERVICE_ID,
  user_id: EMAILJS_USER_ID,
  templates: {
    notification: EMAILJS_NOTIFICATION_TEMPLATE_ID,
    reply: EMAILJS_REPLY_TEMPLATE_ID,
  },
};

export const EMAIL_CONFIG_TOKEN = new InjectionToken<EmailConfig>(
  'EMAIL_CONFIG',
);
