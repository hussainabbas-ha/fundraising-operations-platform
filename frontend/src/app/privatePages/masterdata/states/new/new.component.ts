import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { StateService } from '../../../../_services/dataServices/state.service';
import { ImportModule } from '../../../../core/import/import.module';
import { VMessageComponent } from '../../../../core/v-message/v-message.component';

@Component({
  selector: 'app-new',
  standalone: true,
  imports: [ImportModule, VMessageComponent],
  templateUrl: './new.component.html',
  styleUrl: './new.component.scss'
})
export class NewComponent implements OnInit{
  form: FormGroup;
  _id: string = '';

  constructor(
    private formBuilder: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<NewComponent>,
    private toaster: ToastrService,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private stateService: StateService
  ) {
    if (this.data.id) {
      this._id = this.data.id;
      this.getSingleState(this._id);
    }
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      abbreviation: ['', [Validators.required]],
    })
  }
  ngOnInit(): void {

  }

  getSingleState(id: string) {
    const sub = this.stateService.getSingleState(id).subscribe({
      next: (res) => {
        let data = res['data'];
        this.form.patchValue({
          name: data?.name ? data?.name : '',
          abbreviation: data?.abbreviation ? data?.abbreviation : '',
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
        const sub = this.stateService.createOrUpdateRegion(data, this._id).subscribe({
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
        const sub = this.stateService.createOrUpdateRegion(data).subscribe({
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
