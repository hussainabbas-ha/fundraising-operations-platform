import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ImportModule } from '../../../core/import/import.module';
import { VMessageComponent } from '../../../core/v-message/v-message.component';
import { OrganizationService } from '../../../_services/dataServices/organization.service';
import { LookupService } from '../../../_services/dataServices/lookup.service';
import { LbAutoCompleteComponent } from '../../../core/lb-auto-complete/lb-auto-complete.component';
import { lookupData, User } from '../../../core/modals';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../_services/common/auth.service';

@Component({
  selector: 'app-new',
  standalone: true,
  imports: [ImportModule, VMessageComponent, LbAutoCompleteComponent],
  templateUrl: './new.component.html',
  styleUrl: './new.component.scss'
})
export class NewComponent implements OnInit {
  form: FormGroup;
  _id: string = '';
  upload: boolean = false;
  images: any = [];
  imagePreview: string | undefined = '';
  selectCompany: lookupData[] = [];
  userInfo: User | undefined;
  userSub: Subscription;
  constructor(
    private formBuilder: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<NewComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private organizationService: OrganizationService,
    private lookupService: LookupService,
    private _authService: AuthService
  ) {
    if (this.data.id) {
      this._id = this.data.id;
      this.getSingleOrganization(this._id);
    }
    this.userSub = this._authService.userInfo.subscribe(res => {
      if (res != null) {
        this.userInfo = res;
      }
    });
    
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(/^(?!.*\.\.)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      phoneNo: ['', [Validators.required , Validators.pattern(/^(?:\+1\s?)?(?:\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}$/)]],
    });
    this.getCompanyLookup();
  }

  ngOnInit(): void {

  }
  getSingleOrganization(id: string) {
    const sub = this.organizationService.getSingleOrganization(id).subscribe({
      next: (res) => {
        let data = res['data'];
        this.imagePreview = data?.logo ? data?.logo : '';
        this.form.patchValue({
          name: data?.name ? data?.name : '',
          address: data?.address ? data?.address : '',
          email: data?.email ? data?.email : '',
          phoneNo: data?.phoneNo ? data?.phoneNo : '',

        })
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  selectImage(event: any) {
    this.images=[];
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
  submit() {
    if (this.form.valid) {
      const data = this.form.value;
      if (this._id != '' && this._id != undefined) {
        const sub = this.organizationService.createOrUpdateOrganization(this.images, data, this._id).subscribe({
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
        const sub = this.organizationService.createOrUpdateOrganization(this.images, data).subscribe({
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
}
