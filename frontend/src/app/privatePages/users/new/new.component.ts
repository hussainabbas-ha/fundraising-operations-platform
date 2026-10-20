import { Component, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../../_services/dataServices/user.service';
import { ImportModule } from '../../../core/import/import.module';
import { VMessageComponent } from '../../../core/v-message/v-message.component';
import { lookupData, User } from '../../../core/modals';
import { LbAutoCompleteComponent } from '../../../core/lb-auto-complete/lb-auto-complete.component';
import { LookupService } from '../../../_services/dataServices/lookup.service';
import { DatePickerComponent } from '../../../core/date-picker/date-picker.component';
import { changeDateToApiFormat } from '../../../core/utility';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../_services/common/auth.service';

@Component({
  selector: 'app-new',
  standalone: true,
  imports: [ImportModule, VMessageComponent, LbAutoCompleteComponent, DatePickerComponent],
  templateUrl: './new.component.html',
  styleUrl: './new.component.scss'
})
export class NewComponent implements OnInit, OnDestroy {
  form: FormGroup;
  _id: string = '';
  selectRole: lookupData[] = [];
  selectStatus: lookupData[] = [];
  selectCompany: lookupData[] = [];
  upload: boolean = false;
  showPassword: boolean = false;
  confirmPasswordShow: boolean = false;
  images: any = [];
  imagePreview: string | undefined = '';
  userInfo: User | undefined;
  userSub: Subscription;
  constructor(
    private formBuilder: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<NewComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private userService: UserService,
    private lookupService: LookupService,
    private _authService: AuthService
  ) {
    if (this.data.id) {
      this._id = this.data.id;
      this.getSingleUser(this._id);
    }
    this.userSub = this._authService.userInfo.subscribe(res => {
      if (res != null) {
        this.userInfo = res;
      }
    });
    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      roleId: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(/^(?!.*\.\.)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      confirm_password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)(?!.*\s).+$/), Validators.maxLength(24), Validators.minLength(8)]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)(?!.*\s).+$/), Validators.maxLength(24), Validators.minLength(8)]],
      phoneNo: ['', [Validators.required, Validators.pattern(/^(?:\+1\s?)?(?:\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}$/)]],
      address: ['', [Validators.required]],
      companyId: ['', [Validators.required]],
      status: ['', [Validators.required]],
      zipCode: ['']
    })
    this.getRolesLookup();
    this.getUserStatusLookup();
    this.getCompanyLookup();
  }
  ngOnInit(): void {

  }
  getRolesLookup() {
    const sub = this.lookupService.getRolesLookup().subscribe({
      next: (res) => {
        this.selectRole = res['data'];
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  getUserStatusLookup() {
    const sub = this.lookupService.getAppSettingLookup({ code: 'user_status' }).subscribe({
      next: (res) => {
        this.selectStatus = res['data'];
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  getCompanyLookup() {
    const sub = this.lookupService.getCompanyLookup().subscribe({
      next: (res) => {
        this.selectCompany = res['data'];
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  getSingleUser(id: string) {
    const sub = this.userService.getSingleUser(id).subscribe({
      next: (res) => {
        let data = res['data'];
        this.imagePreview = data?.image ? data?.image : '';
        this.form.patchValue({
          firstName: data?.firstName ? data?.firstName : '',
          lastName: data?.lastName ? data?.lastName : '',
          roleId: data?.roleId ? data?.roleId : '',
          email: data?.email ? data?.email : '',
          phoneNo: data?.phoneNo ? data?.phoneNo : '',
          address: data?.address ? data?.address : '',
          status: data?.status ? data?.status : '',
          zipCode: data?.zipCode ? data?.zipCode : '',
          companyId: data?.companyId ? data?.companyId : ''
        })
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  selectImage(event: any) {
    this.images = [];
    const file = event.target.files[0];
    this.images.push(file);
    var fileAmount = event.target.files.length;
    for (let index = 0; index < fileAmount; index++) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.imagePreview = event.target.result;
      };
      reader.readAsDataURL(event.target.files[index]);
    }

  }

  submit() {
    if (this._id != '' && this._id != undefined) {
      this.form.get('password')?.clearValidators();
      this.form.get('password')?.updateValueAndValidity();
      this.form.get('confirm_password')?.clearValidators();
      this.form.get('confirm_password')?.updateValueAndValidity();
    }
    if (this.form.valid) {
      const data = this.form.value;
      if (this._id != '' && this._id != undefined) {
        const sub = this.userService.createOrUpdateUser(this.images, data, this._id).subscribe({
          next: (res) => {
            this.close();
            sub.unsubscribe();
          },
          error: (res) => {
            sub.unsubscribe();
          },
        });
      }
      else {
        const sub = this.userService.createOrUpdateUser(this.images, data).subscribe({
          next: (res) => {
            this.close();
            sub.unsubscribe();
          },
          error: (res) => {
            sub.unsubscribe();
          },
        });
      }
    }
    else {
      this.form.markAllAsTouched();
    }
  }
  close() {
    this.dialogRef.close();
  }
  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
