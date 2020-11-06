import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-activate',
  templateUrl: './activate.page.html',
  styleUrls: ['./activate.page.scss'],
})
export class ActivatePage implements OnInit {
  
  actForm: FormGroup;
  CurrentState: any;
  jwtToken: null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute) {
      this.CurrentState = 'Wait';
      this.route.params.subscribe(params => {
        this.jwtToken = params.jwt;
        this.VerifyJwtToken();
      });
      this.actForm = this.formBuilder.group({
        token: ['', [Validators.required ]],
      });
    }

  ngOnInit() {
  }
  VerifyJwtToken() {
    this.authService.ValidToken({ jwttoken: this.jwtToken }).subscribe(
      data => {
        this.CurrentState = 'Verified';
        setTimeout(() => {
          this.router.navigateByUrl('login');
        }, 3000);
      },
      err => {
        this.CurrentState = 'NotVerified';
      }
    );
  }

}
