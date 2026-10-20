import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImportModule } from '../../../core/import/import.module';
import { VMessageComponent } from '../../../core/v-message/v-message.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VendorService } from '../../../_services/dataServices/vendor.service';

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
    private vendorService: VendorService
  ) {
    if (this.data.id) {
      this._id = this.data.id;
      this.getSingleVendor(this._id);
    }
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      address: ['', Validators.required],
      phoneNo: ['', [Validators.required, Validators.pattern(/^(?:\+1\s?)?(?:\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}$/)]],
    })
  }
  ngOnInit(): void {

  }

  getSingleVendor(id: string) {
    const sub = this.vendorService.getSingleVendor(id).subscribe({
      next: (res) => {
        let data = res['data'];
        this.form.patchValue({
          title: data?.title ? data?.title : '',
          phoneNo: data?.phoneNo ? data?.phoneNo : '',
          address: data?.address ? data?.address : '',
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
      if (this._id != '') {
        const sub = this.vendorService.createOrUpdateVendor(data, this._id).subscribe({
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
        const sub = this.vendorService.createOrUpdateVendor(data).subscribe({
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
