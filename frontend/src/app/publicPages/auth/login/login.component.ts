import { Component, OnInit } from '@angular/core';
import { ImportModule } from '../../../core/import/import.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VMessageComponent } from '../../../core/v-message/v-message.component';
import { AuthService } from '../../../_services/common/auth.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ImportModule, VMessageComponent, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  showPassword:boolean=false;
  returnUrl!: string;
  constructor(
    private formBuilder: FormBuilder,
    private _authService: AuthService,
    private router: Router, 
    private route: ActivatedRoute
  ) {
    this.form = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(/^(?!.*\.\.)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      password: [null, [Validators.required, Validators.maxLength(16), Validators.minLength(8)]]
    });
   
  }
  ngOnInit(): void {
    if (this.route.snapshot.queryParams['returnUrl']) {
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'].replace(/->/g, '/');
    }

  }
  submit() {
    if (this.form.valid) {
      const sub = this._authService.login(this.form.value.email, this.form.value.password).subscribe({
        next: res => {
          if (this.returnUrl) {
            this.router.navigateByUrl(this.returnUrl);
            this.form.reset();
          } else {
            this.router.navigateByUrl('/dashboard');
            this.form.reset();
          }
          sub.unsubscribe();
        }, error: res => {
          sub.unsubscribe();
        }
      });
    } else {
      this.form.markAllAsTouched();
    }

  }

}
