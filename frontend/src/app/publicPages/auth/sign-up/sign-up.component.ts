import { Component, OnDestroy, OnInit } from '@angular/core';
import { ImportModule } from '../../../core/import/import.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VMessageComponent } from '../../../core/v-message/v-message.component';
import { AuthService } from '../../../_services/common/auth.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ImportModule, VMessageComponent],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent implements OnInit, OnDestroy {
  form: FormGroup;
  showPassword: boolean = false;
  confirmPasswordShow: boolean = false;
  qSub: Subscription;
  queryParams: Params = {};
  valid: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(/^(?!.*\.\.)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      confirm_password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)(?!.*\s).+$/), Validators.maxLength(24), Validators.minLength(8)]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)(?!.*\s).+$/), Validators.maxLength(24), Validators.minLength(8)]],
      phoneNo: ['', [Validators.required, Validators.pattern(/^(?:\+1\s?)?(?:\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}$/)]],
      address: ['', [Validators.required]],
      zipCode: ['', [Validators.pattern(/^\d{5}(-\d{4})?$/)]]
    });
    this.qSub = this.route.queryParams.subscribe(res => {
      Object.assign(this.queryParams, res);
    });
    this.validateUrl();
  }
  ngOnInit(): void {
  }

  validateUrl() {
    const sub = this.authService.validateUrl(this.queryParams).subscribe({
      next: (res) => {
        this.valid = res.data.success;
        this.form.patchValue({
          email: res.data?.email,
          firstName : res.data?.firstName ?? '',
          lastName : res.data?.lastName ?? '', 
        })
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  submit() {
    if (this.form.valid) {
      const data = this.form.value;
      data.code = this.queryParams['code'];
      data.zipCode = data.zipCode.toString();
      const sub = this.authService.registerUser(data).subscribe({
        next: (res) => {
          this.router.navigate(['login'])
          sub.unsubscribe();
        },
        error: (res) => {
          sub.unsubscribe();
        },
      });
    }
    else {
      this.form.markAllAsTouched();
    }
  }
  ngOnDestroy(): void {
    this.qSub.unsubscribe();
  }
}
