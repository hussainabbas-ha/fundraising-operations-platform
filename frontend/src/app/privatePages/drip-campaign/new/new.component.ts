import { Component, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { DripCampaignService } from '../../../_services/dataServices/dripCampaign.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ImportModule } from '../../../core/import/import.module';
import { VMessageComponent } from '../../../core/v-message/v-message.component';
import { lookupData, User } from '../../../core/modals';
import { AuthService } from '../../../_services/common/auth.service';
import { Subscription } from 'rxjs';
import { LbAutoCompleteComponent } from '../../../core/lb-auto-complete/lb-auto-complete.component';
import { LookupService } from '../../../_services/dataServices/lookup.service';
import { TextEditorComponent } from '../../../core/text-editor/text-editor.component';

@Component({
  selector: 'app-new',
  standalone: true,
  imports: [ImportModule, VMessageComponent, LbAutoCompleteComponent, TextEditorComponent],
  templateUrl: './new.component.html',
  styleUrl: './new.component.scss'
})
export class NewComponent implements OnInit, OnDestroy{
  form: FormGroup;
  _id: string = '';
  selectCompany: lookupData[] = [];
  selectType: lookupData[] = [];
  userInfo: User | undefined;
  userSub: Subscription;
  constructor(
    private formBuilder: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<NewComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dripCampaignService: DripCampaignService,
    private _authService: AuthService,
    private lookupService: LookupService,
  ) {
    if (this.data.id) {
      this._id = this.data.id;
      this.getSingleDripCampaign(this._id);
    }
    this.userSub = this._authService.userInfo.subscribe(res => {
      if (res != null) {
        this.userInfo = res;
      }
    });
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      day: ['', Validators.required],
      smsTime: ['', Validators.required],
      emailTime: ['', Validators.required],
      sms: ['', Validators.required],
      emailSubject: ['', Validators.required],
      emailMessage: ['', Validators.required],
      companyId: [''],
      type: [''],
    });
    this.getCompanyLookup();
    this.getDripCampaignTypeLookup();
  }
  ngOnInit(): void {

  }

  getSingleDripCampaign(id: string) {
    const sub = this.dripCampaignService.getSingleDripCampaign(id).subscribe({
      next: (res) => {
        let data = res['data'];
        this.form.patchValue({
          title: data?.title ? data?.title : '',
          type: data?.type ? data?.type : '',
          day: data?.day ? data?.day : '',
          smsTime: data?.smsTime ? data?.smsTime : '',
          emailTime: data?.emailTime ? data?.emailTime : '',
          sms: data?.sms ? data?.sms : '',
          emailSubject: data?.emailSubject ? data?.emailSubject : '',
          emailMessage: data?.emailMessage ? data?.emailMessage : '',
          companyId: data?.companyId ? data?.companyId : '',
        })
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
  getDripCampaignTypeLookup() {
    const sub = this.lookupService.getDripCampaignTypeLookup().subscribe({
      next: (res) => {
        this.selectType = res['data'];
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
      if (this._id != '') {
        const sub = this.dripCampaignService.createOrUpdateDripCampaign(data, this._id).subscribe({
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
        const sub = this.dripCampaignService.createOrUpdateDripCampaign(data).subscribe({
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
