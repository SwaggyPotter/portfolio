import { Component } from '@angular/core';
import emailjs from '@emailjs/browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent {
  form: FormGroup = this.fb.group({
    from_name: ['', Validators.required],
    from_email: ['', [Validators.required, Validators.email]],
    message: ['', Validators.required]
  });

  constructor(private fb: FormBuilder) { }
  sended: boolean = false;
  invalidEmail: boolean = false;

  checkEmail() {
    if (this.form.get('from_email')?.errors) {
      this.invalidEmail = true;
    }
    else {
      this.invalidEmail = false;
    }
  }

  emailSend() {
    this.sended = true;
    setTimeout(() => {
      this.sended = false;
    }, 2000)
  }

  async send() {
    if (this.form.valid) {
      emailjs.init('HXRHgLXNMAqXvgQza');
      let response = await emailjs.send('service_gjpw7iv', 'template_7extjmi', {
        from_name: this.form.value.from_name,
        from_email: this.form.value.from_email,
        message: this.form.value.message
      });
      this.emailSend()
      this.form.reset();
    }
    if (this.form.get('from_email')?.errors) {
      this.invalidEmail = true;
    }
  }
}