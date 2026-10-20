import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImportModule } from '../../../core/import/import.module';
import { VMessageComponent } from '../../../core/v-message/v-message.component';
import { lookupData, User } from '../../../core/modals';
import { UserService } from '../../../_services/dataServices/user.service';
import { AuthService } from '../../../_services/common/auth.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LookupService } from '../../../_services/dataServices/lookup.service';

@Component({
  selector: 'app-update',
  standalone: true,
  imports: [ImportModule, VMessageComponent],
  templateUrl: './update.component.html',
  styleUrl: './update.component.scss'
})
export class UpdateComponent {
  form: FormGroup;
  _id: string = '';
  upload: boolean = false;
  showPassword: boolean = false;
  confirmPasswordShow: boolean = false;
  images: any = [];
  imagePreview: string | undefined = '';
  userInfo: User | undefined;
  constructor(
    private formBuilder: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<UpdateComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private userService: UserService
  ) {

    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(/^(?!.*\.\.)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      phoneNo: ['', [Validators.required, Validators.pattern(/^(?:\+1\s?)?(?:\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}$/)]],
      address: ['', [Validators.required]],
      zipCode: ['', [Validators.pattern(/^\d{5}(-\d{4})?$/)]]
    });
    if (this.data.data) {
      this.patchData(this.data?.data)
    }

  }
  ngOnInit(): void {

  }


  patchData(data: any) {
    this.imagePreview = data?.image ? data?.image : '';
    this.form.patchValue({
      firstName: data?.firstName ? data?.firstName : '',
      lastName: data?.lastName ? data?.lastName : '',
      email: data?.email ? data?.email : '',
      phoneNo: data?.phoneNo ? data?.phoneNo : '',
      address: data?.address ? data?.address : '',
      zipCode: data?.zipCode ? data?.zipCode : '',
    })

  }
  selectImage(event: any) {
    this.images = [];
    const file = event.target.files[0];
    this.images.push(file);
    var fileAmount = event.target.files.length;
    for (let index = 0; index < fileAmount; index++) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.imagePreview = event.target.result;
      };
      reader.readAsDataURL(event.target.files[index]);
    }

  }

  submit() {
    if (this.form.valid) {
      const data = this.form.value;
      const sub = this.userService.updateProfile(this.images, data).subscribe({
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
      this.form.markAllAsTouched();
    }
  }
  close() {
    this.dialogRef.close();
  }

}
