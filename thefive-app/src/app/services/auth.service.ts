import { Platform, AlertController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Storage } from '@ionic/storage';
import { environment } from '../../environments/environment';
import { tap, catchError, take, map, switchMap } from 'rxjs/operators';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { Router } from '@angular/router';
import { resetFakeAsyncZone } from '@angular/core/testing';
 
const TOKEN_KEY = 'access_token';
const helper = new JwtHelperService();
 
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user: Observable<any>;
  private userData = new BehaviorSubject(null);
  new_token: String;
 
  url = environment.url;

  constructor(private http: HttpClient, private helper: JwtHelperService, private storage: Storage,
    private plt: Platform, private alertController: AlertController, private router: Router) {
      this.loadStoredToken();  
  }
 

  loadStoredToken() {
    let platformObs = from(this.plt.ready());
 
    this.user = platformObs.pipe(
      switchMap(() => {
        return from(this.storage.get(TOKEN_KEY));
      }),
      map(token => {
        if (token) {
          let decoded = helper.decodeToken(token); 
          this.new_token = decoded;
          this.userData.next(decoded);
          return true;
        } else {
          return null;
        }
      })
    );
  }
 
  register(credentials) {
    return this.http.post(`${this.url}/api/register`, credentials).pipe(
      tap(res => {
        this.showSuccess(res['msg']);
      }),
      catchError(e => {
        console.log(e);
        this.showAlert(e.error.msg);
        throw new Error(e);
      })
    );
  }
 
  login(credentials) {
    if(!credentials.email || !credentials.password) {
      return of(null);
    }
    return this.http.post(`${this.url}/api/login`, credentials)
      .pipe(
        take(1),
        map(res => {
          return res['token'];
        }),
        switchMap(token => {
          let decoded = helper.decodeToken(token);
          this.userData.next(decoded);
   
          let storageObs = from(this.storage.set(TOKEN_KEY, token));
          return storageObs;
        }),
        catchError(e => {
          console.log(e);
          this.showAlert(e.error.msg);
          throw new Error(e);
        })
      );
  }

  requestReset(credentials) {
    return this.http.post(`${this.url}/api/request-password`, credentials).pipe(
      catchError(e => {
        console.log(e);
        this.showAlert(e.error.msg);
        throw new Error(e);
      })
    );
  }
  
  newPassword(credentials) {
    return this.http.post(`${this.url}/api/new-password`, credentials).pipe(
      tap(res => {
        this.showSuccess(res['msg']);
      }),
      catchError(e => {
        console.log(e)
        this.showAlert(e.error.msg);
        throw new Error(e);
      })
    );
  }

  ValidToken(credentials) {
    return this.http.post(`${this.url}/api/activate`, credentials).pipe(
      tap(res => {
        this.showSuccess(res['msg']);
      }),
      catchError(e => {
        console.log(e);
        this.showAlert(e.error.msg);
        throw new Error(e);
      })
    );
  }

  ValidPasswordToken(credentials) {
    return this.http.post(`${this.url}/api/valid-token`, credentials).pipe(
      tap(res => {
        this.showSuccess(res['msg']);
      }),
      catchError(e => {
        this.showAlert(e.error.msg);
        throw new Error(e);
      })
    );
  }

  logout() {
    this.storage.remove(TOKEN_KEY).then(() => {
      this.router.navigateByUrl('/');
      this.userData.next(null);
    });
  }


  getUser() {
    return this.userData.getValue();
  }

  uploadFile(file) {
    file.append('token', this.new_token['email']);
    return this.http.post(`${this.url}/api/fileupload`, file).pipe(
      tap(res => {
        this.showSuccess('Image successfully uploaded.');
      }),
      catchError(e => {
        console.log(e);
        this.showAlert(e.error.msg);
        throw new Error(e);
      })
    );

  }

  getImages() {
    return this.http.get(`${this.url}/api/images`).pipe(
      tap(res => {
        return res
      }),
      catchError(e => {
        throw new Error(e);
      })
    );
  }

 
  showAlert(msg) {
    let alert = this.alertController.create({
      message: msg,
      header: 'Error',
      buttons: ['OK']
    });
    alert.then(alert => alert.present());
  }
  showSuccess(msg) {
    let alert = this.alertController.create({
      message: msg,
      header: 'Success',
      buttons: ['OK']
    });
    alert.then(alert => alert.present());
  }
}