import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../_services/dataServices/user.service';
import { LookupService } from '../../_services/dataServices/lookup.service';
import { AuthService } from '../../_services/common/auth.service';
import { LbAutoCompleteComponent } from '../../core/lb-auto-complete/lb-auto-complete.component';
import { VMessageComponent } from '../../core/v-message/v-message.component';
import { ImportModule } from '../../core/import/import.module';
import { lookupData, User } from '../../core/modals';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-invite-user',
  standalone: true,
  imports: [ImportModule, VMessageComponent, LbAutoCompleteComponent],
  templateUrl: './invite-user.component.html',
  styleUrl: './invite-user.component.scss'
})
export class InviteUserComponent implements OnInit {
  selectRole: lookupData[] = [];
  userInfo: User | undefined;
  userSub: Subscription | undefined;
  form: FormGroup;
  _id: string = '';
  constructor(
    private formBuilder: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<InviteUserComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private userService: UserService,
    private lookupService: LookupService,
    private _authService: AuthService

  ) {
    if (this.data?.id) {
      this._id = this.data.id;
    }
    if (!this._id) {
      this.userSub = this._authService.userInfo.subscribe(res => {
        if (res != null) {
          this.userInfo = res;
        }
      });
    }

    this.form = this.formBuilder.group({
      roleId: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(/^(?!.*\.\.)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      companyId: [this.userInfo?.companyId, [Validators.required]],

    })
    this.getRolesLookup();
  }
  ngOnInit(): void {

  }
  getRolesLookup() {
    const sub = this.lookupService.getRolesLookup().subscribe({
      next: (res) => {
        this.selectRole = res['data'];
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
      const sub = this.userService.inviteUser(data).subscribe({
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
  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }

  }
}
