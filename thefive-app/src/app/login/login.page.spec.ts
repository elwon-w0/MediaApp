import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { LoginPage } from './login.page';
import { Storage, IonicStorageModule } from '@ionic/storage';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';

export function jwtOptionsFactory(storage) {
  return {
    tokenGetter: () => {
      return storage.get('access_token');
    },
    whitelistedDomains: ['localhost:5000']
  }
}

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginPage ],
      imports: [IonicModule.forRoot(),RouterTestingModule.withRoutes([]),IonicStorageModule.forRoot(),
        JwtModule.forRoot({
          jwtOptionsProvider: {
            provide: JWT_OPTIONS,
            useFactory: jwtOptionsFactory,
            deps: [Storage],
          }
        }),
        ReactiveFormsModule,
        HttpClientModule]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('login form validity for email (invalid email)', () => {
    let loginEmail = component.credentialsForm.controls['email'];
	loginEmail.setValue("");
	loginEmail.setValue("adam@hacker");
	loginEmail.setValue("adam@hacker.malicious");
	loginEmail.setValue("adam@hacker.m");
	loginEmail.setValue("'OR 1=1");
	loginEmail.setValue("'");
	loginEmail.setValue("AND true");
	loginEmail.setValue("'a'; sleep(5000)");
	loginEmail.setValue("'; return '' == '");
	loginEmail.setValue("'; while(true){}'");
    expect(loginEmail.valid).toBeFalsy();
  });
  
  it('login form validity for email (valid email)', () => {
    let loginEmail = component.credentialsForm.controls['email'];
	loginEmail.setValue("adam@hacker.com");
	loginEmail.setValue("adam@hacker.sit.singaporetech.edu.sg");
	loginEmail.setValue("adam@hacker.net");
	loginEmail.setValue("adam@hacker.sg");
    expect(loginEmail.valid).toBeTruthy();
  });
  
  it('login form validity for password (invalid password)', () => {
    let loginPassword = component.credentialsForm.controls['password'];
	loginPassword.setValue("password");
	expect(loginPassword.valid).toBeFalsy();
	loginPassword.setValue("");
	expect(loginPassword.valid).toBeFalsy();
	loginPassword.setValue("p");
	expect(loginPassword.valid).toBeFalsy();
	loginPassword.setValue("pa");
	expect(loginPassword.valid).toBeFalsy();
	loginPassword.setValue("pas");
	expect(loginPassword.valid).toBeFalsy();
	loginPassword.setValue("pass");
	expect(loginPassword.valid).toBeFalsy();
	loginPassword.setValue("passw");
	expect(loginPassword.valid).toBeFalsy();
	loginPassword.setValue("passwo");
	expect(loginPassword.valid).toBeFalsy();
	loginPassword.setValue("passwor");
	expect(loginPassword.valid).toBeFalsy();
	loginPassword.setValue("password1");
	expect(loginPassword.valid).toBeFalsy();
	loginPassword.setValue("p@ssword1");
	expect(loginPassword.valid).toBeFalsy();
	loginPassword.setValue("P@ssword1");
	expect(loginPassword.valid).toBeFalsy();
	loginPassword.setValue("Password1111111111111");
	expect(loginPassword.valid).toBeFalsy();
	loginPassword.setValue("'OR 1=1");
	expect(loginPassword.valid).toBeFalsy();
	loginPassword.setValue("'");
	expect(loginPassword.valid).toBeFalsy();
	loginPassword.setValue("AND true");
	expect(loginPassword.valid).toBeFalsy();
	loginPassword.setValue("'a'; sleep(5000)");
	expect(loginPassword.valid).toBeFalsy();
	loginPassword.setValue("'; return '' == '");
	expect(loginPassword.valid).toBeFalsy();
	loginPassword.setValue("'; while(true){}'");
	expect(loginPassword.valid).toBeFalsy();
  });
  
  it('login form validity for password (valid password)', () => {
    let loginPassword = component.credentialsForm.controls['password'];
	loginPassword.setValue("Password1");
	expect(loginPassword.valid).toBeTruthy();
	loginPassword.setValue("Passw0rd1");
	expect(loginPassword.valid).toBeTruthy();
  });
});
