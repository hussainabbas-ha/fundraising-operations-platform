import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { VMessageComponent } from '../../../core/v-message/v-message.component';
import { LbAutoCompleteComponent } from '../../../core/lb-auto-complete/lb-auto-complete.component';
import { ImportModule } from '../../../core/import/import.module';
import { ContactGroupService } from '../../../_services/dataServices/contactGroup.service';
import { title } from 'process';
import { lookupData } from '../../../core/modals';
import { LookupService } from '../../../_services/dataServices/lookup.service';

@Component({
  selector: 'app-add-contact-group',
  standalone: true,
  imports: [ImportModule, VMessageComponent, LbAutoCompleteComponent],
  templateUrl: './add-contact-group.component.html',
  styleUrl: './add-contact-group.component.scss'
})
export class AddContactGroupComponent {
  form: FormGroup;
  _id: string = '';
  selectContacts: lookupData[] = [];
  constructor(
    private formBuilder: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<AddContactGroupComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private contactGroupService: ContactGroupService,
    private lookupService: LookupService

  ) {
    if (this.data.id) {
      this._id = this.data.id;
      this.getSingleContactGroup(this._id);
    }
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      contacts: ['', Validators.required]
    });
    this.getContactsLookup();

  }
  ngOnInit(): void {

  }

  getContactsLookup() {
    const sub = this.lookupService.getContactsLookup().subscribe({
      next: (res) => {
        this.selectContacts = res['data'];
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  getSingleContactGroup(id: string) {
    const sub = this.contactGroupService.getSingleContactGroup(id).subscribe({
      next: (res) => {
        let data = res['data'];
        this.form.patchValue({
          title: data?.title ? data?.title : '',
          contacts: data?.contacts ? data?.contacts : '',
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
        const sub = this.contactGroupService.createOrUpdateContactGroup(data, this._id).subscribe({
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
        const sub = this.contactGroupService.createOrUpdateContactGroup(data).subscribe({
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
