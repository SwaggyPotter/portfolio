import { Component } from '@angular/core';
import emailjs from '@emailjs/browser';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent {
  form: FormGroup = this.fb.group({
    from_name: "",
    from_email: "",
    message: "",
  })

  constructor(private fb: FormBuilder) {

  }

  async send() {
    emailjs.init('HXRHgLXNMAqXvgQza')
    let response = await emailjs.send("service_gjpw7iv", "template_7extjmi", {
      from_name: this.form.value.from_name,
      from_email: this.form.value.from_email,
      message: this.form.value.message,
    });

    alert('Message send')
    this.form.reset()
  }
}
