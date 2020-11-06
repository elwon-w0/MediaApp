import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Validator } from '../_helpers/must-match';

@Component({
  selector: 'app-response-reset',
  templateUrl: './response-reset.page.html',
  styleUrls: ['./response-reset.page.scss'],
})
export class ResponseResetPage implements OnInit {
  ResponseResetForm: FormGroup;
  errorMessage: string;
  successMessage: string;
  resetToken: null;
  CurrentState: any;
  IsResetFormValid = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private customValidator: Validator ) {
      
      this.CurrentState = 'Wait';
      this.route.params.subscribe(params => {
        this.resetToken = params.token;
        this.VerifyToken();
     });
    }

  ngOnInit() {
    this.Init();
  }
  get ResponseForm() { return this.ResponseResetForm.controls; }

  VerifyToken() {
    this.authService.ValidPasswordToken({ resettoken: this.resetToken }).subscribe(
      data => {
        this.CurrentState = 'Verified';
      },
      err => {
        this.CurrentState = 'NotVerified';
      }
    );
  }

  Init() {
    this.ResponseResetForm = this.fb.group(
      {
        resettoken: [this.resetToken],
        newpassword: ['', Validators.compose([Validators.required, this.customValidator.patternValidator()])],
        confirmpassword: ['', [Validators.required]]
      },
      {
        validator: this.customValidator.MatchPassword('newpassword', 'confirmpassword')
      }
    );
  }


  ResetPassword(form) {
    // console.log(form.get('confirmPassword'));
    if (form.valid) {
      this.IsResetFormValid = true;
      this.authService.newPassword(this.ResponseResetForm.value).subscribe(
        data => {
          console.log(data);
          this.ResponseResetForm.reset();
          // this.successMessage = data.message;
          setTimeout(() => {
            this.successMessage = null;
            this.router.navigate(['login']);
          }, 3000);
        },
      );
    } else { this.IsResetFormValid = false; }
  }
  
}
