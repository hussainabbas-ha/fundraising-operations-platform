import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { ToastrService } from 'ngx-toastr';

import { Router } from '@angular/router';
import { AuthService } from '../../_services/common/auth.service';
import { TokenService } from '../../_services/common/token.service';
import { LoadingService } from '../../_services/common/loading.service';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
	constructor(private _auth: AuthService, private toastr: ToastrService, private tokenService: TokenService, private router: Router, private loading: LoadingService) {

	}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

		return next.handle(request).pipe(
			tap((evt: any) => {
				if (evt.body) {
					this.loading.end();
					if (evt.body.token) {
						this.tokenService.token = evt.body.token;
						// this._auth.updateUser();
					}
					if(evt.body.success == true && evt.body.message) {
						this.toastr.success(evt.body.message, 'Success')
					}
				}
			}),
			catchError(res => {
				this.loading.end();
				let error = res.error.message || res.statusText;
				console.log(res);
				if (res.status === 401) {
					// auto logout if 401 response returned from api
					this.router.navigateByUrl('/');
				}
				if(res.status === 400){
					error = (res.error.error) ? res.error.error: res.error.message;
				}
				let r = '';
				if (typeof error === 'object') {
					Object.keys(error).forEach(field => {
						const e = error[field];
						r += '<p>' + field.substr(0, 1).toUpperCase() + field.substr(1, 100) + ': ' + e[0] + '</p>';
					});
				}
				if (r) {
					this.toastr.error(r, '', {
						enableHtml: true
					});
				} else {
					this.toastr.error(error, 'Error');
				}
				return throwError(() => res);
			}));
	}
}
