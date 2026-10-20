import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Params, Router } from '@angular/router';
import { TokenService } from './token.service';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../environments/environment';
import { User } from '../../core/modals';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private checkLogin = new BehaviorSubject<boolean>(false);
  loginOB = this.checkLogin.asObservable();
  private user = new BehaviorSubject<User | null>(null);
  userInfo = this.user.asObservable();
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private http: HttpClient, private jwtHelper: JwtHelperService, private router: Router, private tokenService: TokenService) {
  }
  public login(email: string, password: string) {
    return this.http.post<{ success: boolean, error: boolean, token?: string, message: string }>(environment.api + 'auth/login', { email, password })
      .pipe(map(res => {
        if (res && res.token) {
          this.tokenService.token = res.token;
          this.isLoggedIn;
          this.updateUser();
        }
        return res;
      }));
  }
  public forgotPassword(userName: string) {
    return this.http.post(environment.api + 'auth/resetPassword', { userName }).pipe(map(res => {
      return res;
    }));
  }



  validateUrl(params: Params) {
    return this.http.get<{ success: boolean, data: any }>(environment.api + 'auth/validateLink', { params }).pipe(map((res) => {
      return res;
    })
    );
  }

  registerUser(data: User) {
    return this.http.post(environment.api + 'auth/register', data).pipe(map((res) => {
      return res;
    })
    );
  }

  public get isLoggedIn(): boolean {
    let loggedin = !this.jwtHelper.isTokenExpired(this.tokenService.token);
    if (loggedin === false) {
      this.logout();
    }
    this.checkLogin.next(loggedin);
    return loggedin;
  }

  public get loggedIn(): boolean {
    return this.checkLogin.value;
  }

  public updateUser(): void {
    let decodeToken = this.jwtHelper.decodeToken(this.tokenService.token);
    this.user.next(decodeToken);
  }
  public get userDetails(): User | null {
    if (this.checkLogin.value === true) {
      if (this.user.value == null) {
        this.updateUser();
      }
      return this.user.value;
    } else {
      return null;
    }
  }

  logout() {
    // remove user from local storage to log user out
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('accessToken');
    }
    this.checkLogin.next(false);
    this.user.next(null);
    this.router.navigate(['/login']);
  }
}
