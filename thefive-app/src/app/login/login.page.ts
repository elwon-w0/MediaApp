import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  credentialsForm: FormGroup;
  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router,) { 
    this.credentialsForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9._]+[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,5}') ]],
      password: ['', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,20}$')]]
    });
  }
 
  ngOnInit() {

  }


  public errorMessages = {
    email: [
      { type: 'required', message: 'This field is required' },
    ],
    password: [
      { type: 'required', message: 'This field is required' },
    ],
  }
  get email() {
    return this.credentialsForm.get("email");
  }
  get password() {
    return this.credentialsForm.get("password");
  }
 
  onSubmit() {
    this.authService.login(this.credentialsForm.value).subscribe(async res => {
      if (res) {
        this.router.navigateByUrl('/user');
      }
    })
  }


}
