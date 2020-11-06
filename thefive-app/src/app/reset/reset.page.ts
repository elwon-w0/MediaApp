import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.page.html',
  styleUrls: ['./reset.page.scss'],
})
export class ResetPage implements OnInit {
  resetForm: FormGroup;
  forbiddenEmails: any;
  errorMessage: string;
  successMessage: string;
  IsvalidForm = true;

  constructor(private authService: AuthService,
    private router: Router) { 
      this.resetForm = new FormGroup({
        'email': new FormControl(null, [Validators.required, Validators.email], this.forbiddenEmails),
      });
    }

  ngOnInit() {
  }
  RequestResetUser(form) {
    if (form.valid) {
      this.IsvalidForm = true;
      this.authService.requestReset(this.resetForm.value).subscribe(
        data => {
          console.log(data);
          this.resetForm.reset();
          this.successMessage = "Reset password link send to email sucessfully.";
          setTimeout(() => {
            this.successMessage = null;
            this.router.navigate(['login']);
          }, 3000);
        }
      );
    } else {
      this.IsvalidForm = false;
    }
  }

}
