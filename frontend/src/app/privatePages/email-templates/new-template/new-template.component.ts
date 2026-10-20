import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EmailTemplateService } from '../../../_services/dataServices/emailTemplate.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImportModule } from '../../../core/import/import.module';
import { VMessageComponent } from '../../../core/v-message/v-message.component';
import { TextEditorComponent } from '../../../core/text-editor/text-editor.component';
import { Fields } from '../../../core/modals';


@Component({
  selector: 'app-new-template',
  standalone: true,
  imports: [ImportModule, VMessageComponent, TextEditorComponent],
  templateUrl: './new-template.component.html',
  styleUrl: './new-template.component.scss'
})
export class NewTemplateComponent implements OnInit, OnDestroy {
  paramsSub: Subscription;
  querySub: Subscription;
  templateId: string = '';
  typeId: string = '';
  queryParams: Params | undefined;
  form: FormGroup;
  fields: Fields[] = [];
  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private emailTemplateService: EmailTemplateService,
    private router: Router
  ) {
    this.paramsSub = this.route.params.subscribe((params) => {
      this.templateId = params['id'];
      if (this.templateId) {
        this.getSingleEmailTemplate();
      }
    });
    this.querySub = this.route.queryParams.subscribe((qparams) => {
      this.queryParams = Object.assign({}, qparams);
      this.typeId = this.queryParams['typeId'];
    });
    if (this.typeId) {

      this.getFieldsByType();
    }
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      subject: ['', Validators.required],
      message: ['', Validators.required],
      sms: [''],
      active: [true, Validators.required],
      emailTypeId: [this.typeId, Validators.required],
    });
  }
  ngOnInit(): void {

  }
  getSingleEmailTemplate() {
    const sub = this.emailTemplateService.getSingleEmailTemplate(this.templateId).subscribe({
      next: (res) => {
        let data = res['data'];
        this.form.patchValue({
          title: data?.title ? data?.title : '',
          subject: data?.subject ? data?.subject : '',
          message: data?.message ? data?.message : '',
          active: data?.active ? data?.active : false,
          sms: data?.sms ? data?.sms : ''
        })
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  getFieldsByType() {
    const sub = this.emailTemplateService.getFieldsByType(this.typeId).subscribe({
      next: (res) => {
        this.fields = res.data.fields;
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
      if (this.templateId != '') {
        const sub = this.emailTemplateService.createOrUpdateEmailTemplate(data, this.templateId).subscribe({
          next: (res) => {
            this.router.navigate(['email-templates']);
            sub.unsubscribe();
          },
          error: (res) => {
            sub.unsubscribe();
          },
        });
      }
      else {
        const sub = this.emailTemplateService.createOrUpdateEmailTemplate(data).subscribe({
          next: (res) => {
            this.router.navigate(['email-templates']);
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

  ngOnDestroy(): void {
    this.querySub.unsubscribe();
    this.paramsSub.unsubscribe();
  }
}
