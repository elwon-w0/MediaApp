import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RegisterPage } from './register.page';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { Storage, IonicStorageModule } from '@ionic/Storage';


export function jwtOptionsFactory(storage) {
    return {
        tokenGetter: () => {
            return storage.get('access_token');
        },
        whitelistedDomains: ['localhost:5000']
    }
}

describe('RegisterPage', () => {
    let component: RegisterPage;
    let fixture: ComponentFixture<RegisterPage>;
    let de: DebugElement;
    let el: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RegisterPage],
            imports: [IonicModule.forRoot(), IonicStorageModule.forRoot(), RouterTestingModule.withRoutes([]), HttpClientTestingModule, ReactiveFormsModule, FormsModule, JwtModule.forRoot({
                jwtOptionsProvider: {
                    provide: JWT_OPTIONS,
                    useFactory: jwtOptionsFactory,
                    deps: [Storage],
                }
            })],
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(RegisterPage);
            component = fixture.componentInstance;
            component.ngOnInit();
            fixture.detectChanges();
            de = fixture.debugElement.query(By.css('form'));
            el = de.nativeElement;
        });

    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RegisterPage);
        component = fixture.componentInstance;
        component.ngOnInit();
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
        component = null;
        de = null;
        el = null;

    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('password is empty (invalid password)', () => {
        let password = component.regForm.controls['password'];
        password.setValue("");
        expect(password.valid).toBeFalsy();
    });

    it('password less than 8 character (invalid password)', () => {
        let password = component.regForm.controls['password'];
        password.setValue("12312");
        expect(password.valid).toBeFalsy();
    });

    it('password more than 8 char but only number (invalid password)', () => {
        let password = component.regForm.controls['password'];
        password.setValue("123456789");
        expect(password.valid).toBeFalsy();
    });

    it('password more than 8 character with alpha but lowercaps (invalid password)', () => {
        let password = component.regForm.controls['password'];
        password.setValue("1234abcde");
        expect(password.valid).toBeFalsy();
    });

    it('password more than 8 character with alpha upper and lowercaps (valid password)', () => {
        let password = component.regForm.controls['password'];
        password.setValue("1234Abcde");
        expect(password.valid).toBeTruthy();
    });

    it('confirmpassword is empty (invalid comfirmpassword)', () => {
        let confirmpassword = component.regForm.controls['confirmpassword'];
        confirmpassword.setValue("");
        expect(confirmpassword.valid).toBeFalsy();
    });

    it('confirmpassword does not match with password (invalid comfirmpassword)', () => {
        let password = component.regForm.controls['password'];
        let confirmpassword = component.regForm.controls['confirmpassword'];
        password.setValue("1234Abcde")
        confirmpassword.setValue("12312");
        expect(confirmpassword.valid).toBeFalsy();
    });

    it('confirmpassword matches with password (valid comfirmpassword)', () => {
        let password = component.regForm.controls['password'];
        let confirmpassword = component.regForm.controls['confirmpassword'];
        password.setValue("1234Abcde")
        confirmpassword.setValue("1234Abcde");
        expect(confirmpassword.valid).toBeTruthy();
    });

    it('gender is empty (invalid gender)', () => {
        let gender = component.regForm.controls['gender'];
        gender.setValue('');
        expect(gender.valid).toBeFalsy();
    });

    it('gender is female (valid gender)', () => {
        let gender = component.regForm.controls['gender'];
        gender.setValue('F');
        expect(gender.valid).toBeTruthy();
    });

    it('gender is male (valid gender)', () => {
        let gender = component.regForm.controls['gender'];
        gender.setValue('M');
        expect(gender.valid).toBeTruthy();
    });

    it('date of birth is empty (invalid dob)', () => {
        let dob = component.regForm.controls['dob'];
        dob.setValue("");
        expect(dob.valid).toBeFalsy();
    });

    it('date of birth (valid dob)', () => {
        let dob = component.regForm.controls['dob'];
        dob.setValue("01/25/1999");
        expect(dob.valid).toBeTruthy();
    });

    it('firstname contain on number (invalid fname)', () => {
        let fname = component.regForm.controls['fname'];
        fname.setValue("Lucas1");
        expect(fname.valid).toBeFalsy();
    });

    it('firstname more than 61 characters (invalid fname)', () => {
        let fname = component.regForm.controls['fname'];
        fname.setValue("Somefirstnameofauserthathavemanycharacterlikemorethansixtyone");
        expect(fname.valid).toBeFalsy(); 
    });

    it('firstname (valid fname)', () => {
        let fname = component.regForm.controls['fname'];
        fname.setValue("Lucas");
        expect(fname.valid).toBeTruthy();
    });

    it('lastname more than  61 characters (invalid lname)', () => {
        let lname = component.regForm.controls['lname'];
        lname.setValue("Somelastnameofauserthathavemanycharacterlikemorethansixtyonee");
        expect(lname.valid).toBeFalsy();
    });

    it('lastname (valid lname)', () => {
        let lname = component.regForm.controls['lname'];
        lname.setValue("Wong");
        expect(lname.valid).toBeTruthy();
    });

    it('email is empty (invalid email)', () => {
        let email = component.regForm.controls['email'];
        email.setValue('');
        expect(email.valid).toBeFalsy();
    });

    it('email wrong format (invalid email)', () => {
        let email = component.regForm.controls['email'];
        email.setValue("");
        expect(email.valid).toBeFalsy();
        email.setValue("adam@hacker");
        expect(email.valid).toBeFalsy();
        email.setValue("adam@hacker.malicious");
        expect(email.valid).toBeFalsy();
        email.setValue("adam@hacker.m");
        expect(email.valid).toBeFalsy();
        email.setValue("'OR 1=1"); expect(email.valid).toBeFalsy();
        email.setValue("'");
        expect(email.valid).toBeFalsy();
        email.setValue("AND true");
        expect(email.valid).toBeFalsy();
        email.setValue("'a'; sleep(5000)");
        expect(email.valid).toBeFalsy();
        email.setValue("'; return '' == '");
        expect(email.valid).toBeFalsy();
        email.setValue("'; while(true){}'");
        expect(email.valid).toBeFalsy();
    });

    it('email correct format (valid email)', () => {
        let email = component.regForm.controls['email'];
        email.setValue("adam@hacker.com");
        expect(email.valid).toBeTruthy();
        email.setValue("adam@hacker.sit.singaporetech.edu.sg");
        expect(email.valid).toBeTruthy();
        email.setValue("adam@hacker.net");
        expect(email.valid).toBeTruthy();
        email.setValue("adam@hacker.sg");
        expect(email.valid).toBeTruthy();
    });

    it('username is empty (invalid username)', () => {
        let username = component.regForm.controls['username'];
        username.setValue('');
        expect(username.valid).toBeFalsy();
    });

    it('username less than 8 characters (invalid username)', () => {
        let username = component.regForm.controls['username'];
        username.setValue('User');
        expect(username.valid).toBeFalsy();
    });

    it('username more than 30 characters (invalid username)', () => {
        let username = component.regForm.controls['username'];
        username.setValue('someusernameaaaaaaaaaaaaaaaaaaa');
        expect(username.valid).toBeFalsy();
    });

    it('username 8-30 characters (valid username)', () => { //???
        let username = component.regForm.controls['username'];
        username.setValue('username');
        expect(username.valid).toBeTruthy();
		username.setValue('Someusername222');
        expect(username.valid).toBeTruthy();
    });

});
