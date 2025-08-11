# SmellyCat Website — Current Implementation

## Overview
The current SmellyCat website is in an early development stage. Most pages are **placeholders**, except for the **Contact** page, which is fully implemented.
The site is **fully responsive**, adapting its layout for desktop, tablet, and mobile devices.

---

## Contact Page

### Features
- **Contact Form** allowing visitors to submit messages.
- **Embedded Google Map** showing the company’s location.
- **Email Functionality** powered by [EmailJS](https://www.emailjs.com/).

---

### Form Submission Behavior

![Contact Form Screenshot](./screenshots/contact-page.png "Contact Page Screenshot")

When a user submits the contact form:

1. **Auto-Reply Email to the Submitter**  
   - Confirms that the message has been received.  

![Confirmation Email Screenshot](./screenshots/auto-reply-email.png "Auto-Reply Email Screenshot")


2. **Notification Email to the Responsible Person/Admin**  
   - Alerts that a new form submission has been received.  
   - Includes the details from the form (name, email, message, etc.).

![Confirmation Email Screenshot](./screenshots/notification-email.png "Notification Email Screenshot")


---
