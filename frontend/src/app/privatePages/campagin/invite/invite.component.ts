import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CampaignService } from '../../../_services/dataServices/campaign.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ImportModule } from '../../../core/import/import.module';
import { VMessageComponent } from '../../../core/v-message/v-message.component';

@Component({
  selector: 'app-invite',
  standalone: true,
  imports: [ImportModule,VMessageComponent],
  templateUrl: './invite.component.html',
  styleUrl: './invite.component.scss'
})
export class InviteComponent implements OnInit {
  form: FormGroup;
  orgId: string = '';
  constructor(
    private formBuilder: FormBuilder,
    @Optional() private dialogRef: MatDialogRef<InviteComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private campaignService: CampaignService

  ) {
    if (data) {
      this.orgId = this.data?.orgId;
    }
    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(/^(?!.*\.\.)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],

    })

  }
  ngOnInit(): void {

  }

  submit() {
    if (this.form.valid) {
      const data = this.form.value;
      if (this.orgId != '') {
        data.organizationId = this.orgId;
      }
      const sub = this.campaignService.inviteLeader(data).subscribe({
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
