import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Validator } from '../_helpers/must-match';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  regForm: FormGroup;
  submitted = false;
  today = new Date().toJSON().split('T')[0];

  constructor(
    private router: Router, 
    private formBuilder: FormBuilder, 
    private authService: AuthService, 
    private customValidator: Validator,
    private alertController: AlertController) {
    this.regForm = this.formBuilder.group({
      gender: ['', [Validators.required ]],
      dob: ['', [Validators.required ]],
      fname: ['', [Validators.required, Validators.pattern('([a-zA-Z]{1,15}[\/]?[ ]?[\,]?[\']?){1,4}') ]],
      lname: ['', [Validators.required, Validators.pattern('([a-zA-Z]{2,15}[ ]?){1,4}')]],
      username: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]{8,30}')]],
      email: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9._]+[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,5}') ]],
      password: ['', Validators.compose([Validators.required, this.customValidator.patternValidator()])],
      confirmpassword: ['', [Validators.required]]
    }, {
      validator: this.customValidator.MatchPassword('password', 'confirmpassword')
    });
   }

   public errorMessages = {
    fname: [
      { type: 'required', message: 'This field is required' },
      { type: 'pattern', message: 'Please enter a valid name.' }
    ],
    lname: [
      { type: 'required', message: 'This field is required' },
      { type: 'pattern', message: 'Please enter a valid name.' }
    ],
    username: [
      { type: 'required', message: 'This field is required' },
      { type: 'pattern', message: 'Please enter a valid username with a minimum of 8 characters.' }
    ],
    email: [
      { type: 'required', message: 'This field is required' },
      { type: 'pattern', message: 'Please enter a valid email.' }
    ],
  }


  ngOnInit() {
  }
  get registerFormControl() { 
    return this.regForm.controls;
  }
  
  register() {
	// Output result in YYYY-MM-DD
    var pass = 0;
    var re = /([0-9]+)-([0-9]+)-([0-9]+)/; 
    var selectedDate = this.regForm.controls.dob.value; 
    var newSelectedDate = selectedDate.replace(re, "$1$2$3");
    var currentDate = this.today;
    var newCurrentDate = currentDate.replace(re, "$1$2$3");
    // console.log(newCurrentDate);
    // console.log(newSelectedDate);

    if (newSelectedDate - parseInt(newCurrentDate) <= 0) {
      this.authService.register(this.regForm.value).subscribe((data) => {
          //enable in prod
          //this.regForm.reset();
          setTimeout(() => {
            this.router.navigateByUrl('login');
          }, 3000);
        });
    } else {
      this.showAlert("Please check your date.")
    }
  }

  showAlert(msg) {
    let alert = this.alertController.create({
      message: msg,
      header: 'Error',
      buttons: ['OK']
    });
    alert.then(alert => alert.present());
  }

}