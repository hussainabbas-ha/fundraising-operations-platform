import { Component, Inject, OnInit, Optional, Type } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImportModule } from '../../../core/import/import.module';
import { VMessageComponent } from '../../../core/v-message/v-message.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LbAutoCompleteComponent } from '../../../core/lb-auto-complete/lb-auto-complete.component';
import { lookupData } from '../../../core/modals';
import { ContactService } from '../../../_services/dataServices/contact.service';
import { LookupService } from '../../../_services/dataServices/lookup.service';

@Component({
  selector: 'app-add-contact',
  standalone: true,
  imports: [ImportModule, VMessageComponent, LbAutoCompleteComponent],
  templateUrl: './add-contact.component.html',
  styleUrl: './add-contact.component.scss'
})
export class AddContactComponent {
  form: FormGroup;
  _id: string = '';
  selectContactType: lookupData[] = [];
  selectEmailType: lookupData[] = [];
  selectPhoneType: lookupData[] = [];
  phoneNo: any[] = [];
  emails: any[] = [];
  constructor(
    private formBuilder: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<AddContactComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private contactService: ContactService,
    private lookupService: LookupService
  ) {
    if (this.data.id) {
      this._id = this.data.id;
      this.getSingleContact(this._id);
    }
    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      contactType: ['phone', [Validators.required]],
      emailType: [''],
      email: ['', [Validators.pattern(/^(?!.*\.\.)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      phoneType: [''],
      phoneNo: ['', [Validators.pattern(/^(?:\+1\s?)?(?:\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}$/)]]
    });
    this.getContactTypeLookup();
    this.getEmailTypeLookup();
    this.getPhoneTypeLookup();
  }
  ngOnInit(): void {

  }

  getSingleContact(id: string) {
    const sub = this.contactService.getSingleContact(id).subscribe({
      next: (res) => {
        let data = res['data'];
        this.form.patchValue({
          firstName: data?.firstName ? data?.firstName : '',
          lastName: data?.lastName ? data?.lastName : '',
          contactType:data?.contactType ? data?.contactType:'',

        });
        data?.phoneNos?.forEach(x=>{
          this.phoneNo.push(x);  
        });
        data?.emails?.forEach(x=>{
          this.emails.push(x);  
        });
       
       
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  getContactTypeLookup() {
    const sub = this.lookupService.getContactTypeLookup().subscribe({
      next: (res) => {
        this.selectContactType = res['data'];
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  getEmailTypeLookup() {
    const sub = this.lookupService.getEmailTypeLookup().subscribe({
      next: (res) => {
        this.selectEmailType = res['data'];
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  getPhoneTypeLookup() {
    const sub = this.lookupService.getPhoneTypeLookup().subscribe({
      next: (res) => {
        this.selectPhoneType = res['data'];
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  pushData() {
    const data = this.form.value;
    const phoneType = this.form.get('phoneType');
    const phoneNo = this.form.get('phoneNo');
    const emailType = this.form.get('emailType');
    const email = this.form.get('email');
    if (data.contactType == 'phone') {
      emailType?.clearValidators();
      email?.clearValidators();
      if (!phoneNo?.value && !phoneType?.value) {
        phoneType?.setValidators([Validators.required]);
        phoneNo?.setValidators([Validators.required]);
        phoneType?.markAllAsTouched();
        phoneNo?.markAllAsTouched();
      }
      else {
        this.phoneNo.push({
          "type": data.phoneType,
          "phoneNo": data.phoneNo
        });
        phoneType?.reset();
        phoneNo?.reset();
      }

    }

    if (data.contactType == 'email') {
      phoneType?.clearValidators();
      phoneNo?.clearValidators();
      if (!email?.value && !emailType?.value) {
        emailType?.setValidators([Validators.required]);
        email?.setValidators([Validators.required]);
        emailType?.markAllAsTouched();
        email?.markAllAsTouched();
      }
      else {
        this.emails.push({
          "type": data.emailType,
          "email": data.email
        });
        emailType?.reset();
        email?.reset();
      }
    }
    phoneType?.updateValueAndValidity();
    phoneNo?.updateValueAndValidity();
    emailType?.updateValueAndValidity();
    email?.updateValueAndValidity();
  }

  remove(item: any, type: string) {
    if (type === 'phoneNo') {
      const index = this.phoneNo.indexOf(item);
      if (index !== -1) {
        this.phoneNo.splice(index, 1);
      }
    } else {
      const index = this.emails.indexOf(item);
      if (index !== -1) {
        this.emails.splice(index, 1);
      }
    }

  }

  submit() {
    if(this._id){
      const contactType = this.form.get('contactType');
      contactType?.clearValidators();
      contactType?.updateValueAndValidity();
    }
    if (this.form.valid && (this.phoneNo.length > 0 || this.emails.length > 0)) {
      const data = this.form.value;
      data.emails = this.emails;
      data.phoneNos = this.phoneNo;
      delete data.contactType;
      delete data.email;
      delete data.phoneNo;
      delete data.phoneType;
      delete data.emailType;
      if (this._id != '') {
        const sub = this.contactService.createOrUpdateContact(data, this._id).subscribe({
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
        const sub = this.contactService.createOrUpdateContact(data).subscribe({
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
