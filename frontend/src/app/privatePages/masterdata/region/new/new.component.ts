import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ImportModule } from '../../../../core/import/import.module';
import { VMessageComponent } from '../../../../core/v-message/v-message.component';
import { RegionService } from '../../../../_services/dataServices/region.service';
import { LookupService } from '../../../../_services/dataServices/lookup.service';
import { LbAutoCompleteComponent } from '../../../../core/lb-auto-complete/lb-auto-complete.component';
import { lookupData } from '../../../../core/modals';

@Component({
  selector: 'app-new',
  standalone: true,
  imports: [ImportModule, VMessageComponent, LbAutoCompleteComponent],
  templateUrl: './new.component.html',
  styleUrl: './new.component.scss'
})
export class NewComponent implements OnInit{
  form: FormGroup;
  _id: string = '';
  selectStates: lookupData[] = [];


  constructor(
    private formBuilder: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<NewComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private regionService: RegionService,
    private lookupService: LookupService

  ) {
    if (this.data.id) {
      this._id = this.data.id;
      this.getSingleRegion(this._id);
    }
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      stateId: ['', Validators.required]
    })
    this.getStatesLookup();
  }
  ngOnInit(): void {

  }
  getStatesLookup() {
    const sub = this.lookupService.getStatesLookup().subscribe({
      next: (res) => {
        this.selectStates = res['data'];
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  getSingleRegion(id: string) {
    const sub = this.regionService.getSingleRegion(id).subscribe({
      next: (res) => {
        let data = res['data'];
        this.form.patchValue({
          name: data?.name ? data?.name : '',
          stateId: data?.stateId ? data?.stateId : '',
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
        const sub = this.regionService.createOrUpdateRegion( data, this._id).subscribe({
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
        const sub = this.regionService.createOrUpdateRegion(data).subscribe({
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
