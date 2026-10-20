import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ImportModule } from '../../../core/import/import.module';
import { VMessageComponent } from '../../../core/v-message/v-message.component';
import { LookupService } from '../../../_services/dataServices/lookup.service';
import { LbAutoCompleteComponent } from '../../../core/lb-auto-complete/lb-auto-complete.component';
import { lookupData, User } from '../../../core/modals';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../_services/common/auth.service';
import { GroupService } from '../../../_services/dataServices/group.service';
import { NewComponent } from '../../organization/new/new.component';

@Component({
  selector: 'app-new-group',
  standalone: true,
  imports: [ImportModule, VMessageComponent, LbAutoCompleteComponent],
  templateUrl: './new-group.component.html',
  styleUrl: './new-group.component.scss'
})
export class NewGroupComponent implements OnInit {
  form: FormGroup;
  _id: string = '';
  upload: boolean = false;
  images: any = [];
  imagePreview: string | undefined = '';
  coverImages: string | undefined = '';
  selectOrganization: lookupData[] = [];
  selectCompany: lookupData[] = [];
  userInfo: User | undefined;
  userSub: Subscription;
  constructor(
    private formBuilder: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<NewGroupComponent, NewComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private groupService: GroupService,
    private dialog: MatDialog,
    private lookupService: LookupService,
    private _authService: AuthService
  ) {
    if (this.data.id) {
      this._id = this.data.id;
      this.getSingleGroup(this._id);
    }
    this.userSub = this._authService.userInfo.subscribe(res => {
      if (res != null) {
        this.userInfo = res;
      }
    });
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      organizationId: ['', [Validators.required]]
    });

    if (this.userInfo?.companyId) {
      this.getOrganizationLookup(this.userInfo?.companyId);
    }
  }

  ngOnInit(): void {

  }
  getSingleGroup(id: string) {
    const sub = this.groupService.getSingleGroup(id).subscribe({
      next: (res) => {
        let data = res['data'];
        this.imagePreview = data?.logo ? data?.logo : '';
        this.coverImages = data?.coverImage ? data?.coverImage : '';
        this.form.patchValue({
          name: data?.name ? data?.name : '',
          organizationId: data?.organizationId ? data?.organizationId : ''
        })
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  selectImage(event: any, imageType: string) {
    const file = event.target.files[0];
    this.images.push({ image: file, type: imageType });
    var fileAmount = event.target.files.length;
    for (let index = 0; index < fileAmount; index++) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        if (imageType == 'logo') {
          this.imagePreview = event.target.result;
        } else {
          this.coverImages = event.target.result;
        }

      };
      reader.readAsDataURL(event.target.files[index]);
    }

  }

  getOrganizationLookup(event: any) {
    const sub = this.lookupService.getOrganizationLookup({ companyId: event }).subscribe({
      next: (res) => {
        this.selectOrganization = res['data'];
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  addOrg(id: string = '') {
    const isMobile = window.innerWidth < 768;
    const DialogRef = this.dialog.open(NewComponent, {
      data: { id: id },
      width: '80%',
      height: isMobile ? '70%' : '',
      disableClose: true,
    });
    const sub = DialogRef.afterClosed().subscribe((res) => {
      this.getOrganizationLookup(this.userInfo?.companyId);
      sub.unsubscribe();
    });
  }

  submit() {
    if (this.form.valid) {
      const data = this.form.value;
      if (this._id != '' && this._id != undefined) {
        const sub = this.groupService.createOrUpdateGroup(this.images, data, this._id).subscribe({
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
        const sub = this.groupService.createOrUpdateGroup(this.images, data).subscribe({
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
