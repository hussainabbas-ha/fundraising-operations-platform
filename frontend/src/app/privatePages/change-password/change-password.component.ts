import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VMessageComponent } from '../../core/v-message/v-message.component';
import { ImportModule } from '../../core/import/import.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../_services/dataServices/user.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [VMessageComponent, ImportModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {
  form: FormGroup;
  showOldPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<ChangePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private userService: UserService
  ) {

    this.form = this.formBuilder.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    })
  }
  ngOnInit(): void {

  }

  submit() {
    if (this.form.valid) {
      const data = this.form.value;
      const sub = this.userService.updatePassword(data).subscribe({
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
