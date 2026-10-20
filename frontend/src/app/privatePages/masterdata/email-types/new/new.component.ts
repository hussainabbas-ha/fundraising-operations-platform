import { Component, Inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VMessageComponent } from '../../../../core/v-message/v-message.component';
import { ImportModule } from '../../../../core/import/import.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EmailTypeService } from '../../../../_services/dataServices/emailType.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-new',
  standalone: true,
  imports: [VMessageComponent , ImportModule],
  templateUrl: './new.component.html',
  styleUrl: './new.component.scss'
})
export class NewComponent implements OnInit,OnDestroy {
 form: FormGroup;
  _id: string = '';
  fields: any[]=[];
  index: number=-1;
  url: string;
  routQSub: Subscription;
  queryParams:Params | undefined;
  constructor(
    private formBuilder: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<NewComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private emailTypeService: EmailTypeService,
    private toaster: ToastrService,
    private router:Router,
    private route:ActivatedRoute
  ) {
    if (this.data.id) {
      this._id = this.data.id;
      this.getSingleCountry(this._id);
    }
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      used_for: ['', Validators.required],
      message: ['', [Validators.required]],
      code: ['', [Validators.required]],
    });
    this.url=this.router.url;
    this.routQSub = this.route.queryParams.subscribe((qparams) => {
      this.queryParams = qparams;
      this.index = qparams['index']?qparams['index']:-1;
    });
  }
  ngOnInit(): void {

  }

  getSingleCountry(id: string) {
    const sub = this.emailTypeService.getSingleEmailType(id).subscribe({
      next: (res) => {
        let data = res['data'];
        this.fields=res['data']?.fields;
        this.form.patchValue({
          title: data?.title ? data?.title : '',
          used_for: data?.used_for ? data?.used_for : '',
        })
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  copyClipboard(text: string) {
    navigator.clipboard.writeText(text);
    this.toaster.success('Copy to Clipboard', 'Cppied');
  }
  
  submit() {
    this.form.get('code')?.clearValidators();
    this.form.get('code')?.updateValueAndValidity();
    this.form.get('message')?.clearValidators();
    this.form.get('message')?.updateValueAndValidity();
    if (this.form.valid) {
      const data = this.form.value;
      data.fields=this.fields;
      if (this._id != '') {
        const sub = this.emailTypeService.createOrUpdateEmailType(data , this._id).subscribe({
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
        const sub = this.emailTypeService.createOrUpdateEmailType(data).subscribe({
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
  addfields(message:string, code:string) {
    if (this.index!=-1) {
      let index=Number(this.index);
      let i = this.fields[index];
      i.code= '{%' + code + '%}'
      i.message=message;
      let newUrl=this.url.split('?')[0];
      this.index=-1;
      window.history.pushState('object', document.title, newUrl);
    }
    else {
      this.fields.push({
        message: message,
        code: '{%' + code + '%}'
      });
    }

    this.form.controls['code'].reset();
    this.form.controls['message'].reset();
  }
  editFields(code : string, message:string, i:number) {
    this.form.patchValue({
      code: code.split('%')[1],
      message: message
    });
    this.router.navigate([], { queryParams: { index: i } });
  }
  ngOnDestroy(): void {
    this.routQSub.unsubscribe();
  }
}
