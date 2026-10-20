import { Component, Inject, OnInit, Optional } from '@angular/core';
import { ImportModule } from '../../../../core/import/import.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { VMessageComponent } from '../../../../core/v-message/v-message.component';
import { CountryService } from '../../../../_services/dataServices/country.service';

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
    private countryService: CountryService
  ) {
    if (this.data.id) {
      this._id = this.data.id;
      this.getSingleCountry(this._id);
    }
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      currency: ['', [Validators.required, Validators.maxLength(3), Validators.minLength(3), Validators.pattern('^[a-zA-Z]*$')]],
      iso3: ['', [Validators.required,Validators.maxLength(3), Validators.minLength(3), Validators.pattern(/^[a-zA-Z]*$/)]],
      phone_code: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(5), Validators.pattern(/^[\d-]*$/)]],
      capital: ['', Validators.required]
    })
  }
  ngOnInit(): void {

  }

  getSingleCountry(id: string) {
    const sub = this.countryService.getSingleCountry(id).subscribe({
      next: (res) => {
        let data = res['data'];
        data['phone_code'] = data['phone_code'].replace("+", "");
        this.form.patchValue({
          name: data?.name ? data?.name : '',
          currency: data?.currency ? data?.currency : '',
          iso3: data?.iso3 ? data?.iso3 : '',
          phone_code: data?.phone_code ? data?.phone_code : '',
          capital: data?.capital ? data?.capital : '',
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
      data['phone_code'] = '+' + data['phone_code'];
      if (this._id != '') {
        const sub = this.countryService.createOrUpdateCountry(data , this._id).subscribe({
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
        const sub = this.countryService.createOrUpdateCountry(data).subscribe({
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
