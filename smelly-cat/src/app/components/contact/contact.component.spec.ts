import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactComponent } from './contact.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { EMAIL_CONFIG_TOKEN, EmailConfig } from '../../configs';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;
  let mockEmailConfig: EmailConfig;
  const EMAILJS_SERVICE_ID = 'service_id';
  const EMAILJS_USER_ID = 'user_id';
  const EMAILJS_NOTIFICATION_TEMPLATE_ID = 'notification_template_id';
  const EMAILJS_REPLY_TEMPLATE_ID = 'reply_template_id';

  beforeEach(async () => {
    mockEmailConfig = {
      service_id: EMAILJS_SERVICE_ID,
      user_id: EMAILJS_USER_ID,
      templates: {
        notification: EMAILJS_NOTIFICATION_TEMPLATE_ID,
        reply: EMAILJS_REPLY_TEMPLATE_ID,
      },
    };
    await TestBed.configureTestingModule({
      imports: [ContactComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: EMAIL_CONFIG_TOKEN, useValue: mockEmailConfig },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
