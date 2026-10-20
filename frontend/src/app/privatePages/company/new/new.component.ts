import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../../_services/dataServices/user.service';
import { ImportModule } from '../../../core/import/import.module';
import { VMessageComponent } from '../../../core/v-message/v-message.component';
import { lookupData } from '../../../core/modals';
import { LbAutoCompleteComponent } from '../../../core/lb-auto-complete/lb-auto-complete.component';
import { LookupService } from '../../../_services/dataServices/lookup.service';
import { DatePickerComponent } from '../../../core/date-picker/date-picker.component';
import { changeDateToApiFormat } from '../../../core/utility';
import { CompanyService } from '../../../_services/dataServices/company.service';


@Component({
  selector: 'app-new',
  standalone: true,
  imports: [ImportModule, VMessageComponent, LbAutoCompleteComponent, DatePickerComponent],
  templateUrl: './new.component.html',
  styleUrl: './new.component.scss'
})
export class NewComponent implements OnInit {
  form: FormGroup;
  _id: string = '';
  selectPackage: lookupData[] = [];
  selectStatus: lookupData[] = [];
  images: any = [];
  imagePreview: string | undefined = '';
  constructor(
    private formBuilder: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<NewComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private companyService: CompanyService,
    private lookupService: LookupService
  ) {
    if (this.data.id) {
      this._id = this.data.id;
      this.getSingleCompany(this._id);
    }
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      licence: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(/^(?!.*\.\.)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      website: ['', [Validators.required, Validators.pattern(/^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/)]],
      subdomain: ['', [Validators.required]],
      address: ['', [Validators.required]],
      phoneNo: ['', [Validators.required, Validators.pattern(/^(?:\+1\s?)?(?:\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}$/)]],
      status: ['', [Validators.required]],
      packageType: ['', [Validators.required]],
      packageValue: ['', [Validators.required]],
      cappedAmount: [0]
    })
    this.getCompanyStatusLookup();
    this.getCompanyPackagesLookup();
  }
  ngOnInit(): void {

  }

  getCompanyStatusLookup() {
    const sub = this.lookupService.getAppSettingLookup({ code: 'company_status' }).subscribe({
      next: (res) => {
        this.selectStatus = res['data'];
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  getCompanyPackagesLookup() {
    const sub = this.lookupService.getAppSettingLookup({ code: 'company_packages' }).subscribe({
      next: (res) => {
        this.selectPackage = res['data'];
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  getSingleCompany(id: string) {
    const sub = this.companyService.getSingleCompany(id).subscribe({
      next: (res) => {
        let data = res['data'];
        this.imagePreview = data?.logo ? data?.logo : '';
        this.form.patchValue({
          name: data?.name ? data?.name : '',
          licence: data?.licence ? data?.licence : '',
          email: data?.email ? data?.email : '',
          website: data?.website ? data?.website : '',
          phoneNo: data?.phoneNo ? data?.phoneNo : '',
          subdomain: data?.subdomain ? data?.subdomain : '',
          status: data?.status ? data?.status : '',
          address: data?.address ? data?.address : '',
          packageType: data?.package?.type ? data?.package?.type : '',
          packageValue: data?.package?.value ? data?.package?.value : '',
          cappedAmount: data?.package?.cappedAmount ? data?.package?.cappedAmount : '',
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
    if (this.form.valid) {
      const data = Object.assign({}, this.form.value);
      data.package = {};
      data['package'].type = data.packageType;
      data['package'].value = data.packageValue;
      if (data.cappedAmount && data.cappedAmount != null) {
        data['package'].cappedAmount = data.cappedAmount;
      }
      if (this._id != '' && this._id != undefined) {
        const sub = this.companyService.createOrUpdateCompany(this.images, data, this._id).subscribe({
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
        const sub = this.companyService.createOrUpdateCompany(this.images, data).subscribe({
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
