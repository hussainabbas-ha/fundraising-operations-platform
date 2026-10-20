import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SettingsService } from '../../../../_services/dataServices/settings.service';
import { ImportModule } from '../../../../core/import/import.module';
import { VMessageComponent } from '../../../../core/v-message/v-message.component';

@Component({
  selector: 'app-new',
  standalone: true,
  imports: [ImportModule, VMessageComponent],
  templateUrl: './new.component.html',
  styleUrl: './new.component.scss'
})
export class NewComponent implements OnInit {
  form: FormGroup;
  _id: string = '';

  constructor(
    private formBuilder: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<NewComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private settingService: SettingsService
  ) {
    if (this.data.id) {
      this._id = this.data.id;
      this.getSingleSetting(this._id);
    }
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      code: ['', [Validators.required]],
      value: ['', Validators.required]
    })
  }
  ngOnInit(): void {

  }

  getSingleSetting(id: string) {
    const sub = this.settingService.getSingleSetting(id).subscribe({
      next: (res) => {
        let data = res['data'];
        this.form.patchValue({
          title: data?.title ? data?.title : '',
          code: data?.code ? data?.code : '',
          value: data?.value ? JSON.stringify(data?.value, null, 2) : ''
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
      data.code=data.code.toLowerCase();
      if (this._id != '') {
        const sub = this.settingService.createOrUpdateSetting(data, this._id).subscribe({
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
        const sub = this.settingService.createOrUpdateSetting(data).subscribe({
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
