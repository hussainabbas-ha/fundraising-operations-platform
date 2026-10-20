import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Pagination } from '../../core/modals/pagination';
import { filter, Subscription, switchMap } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { EmailTemplate, User } from '../../core/modals';
import { ImportModule } from '../../core/import/import.module';
import { PaginationComponent } from '../../core/pagination/pagination.component';
import { PaginationService } from '../../_services/common/pagination.service';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from '../../_services/common/message.service';
import { SortService } from '../../_services/common/sort.service';
import { EmailTemplateService } from '../../_services/dataServices/emailTemplate.service';
import { AuthService } from '../../_services/common/auth.service';

@Component({
  selector: 'app-email-templates',
  standalone: true,
  imports: [ImportModule, PaginationComponent],
  templateUrl: './email-templates.component.html',
  styleUrl: './email-templates.component.scss'
})
export class EmailTemplatesComponent implements OnInit, OnDestroy {
  search: FormGroup;
  pager: Pagination | any;
  qSub: Subscription;
  queryParams: Params = {};
  dataSource: EmailTemplate[] = [];
  emailTypes: any[] = [];
  emailTypeId: string = '';
  userInfo: User | undefined;
  userSub: Subscription;
  constructor(
    private formBuilder: FormBuilder,
    private pagination: PaginationService,
    private emailTempalteService: EmailTemplateService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private messageService: MessageService,
    private sortService: SortService,
    private _authService: AuthService
  ) {
    this.search = this.formBuilder.group({
      q: ['']
    });
    this.getEmailTypes();
    this.qSub = this.route.queryParams.subscribe(res => {
      Object.assign(this.queryParams, res);
      this.emailTypeId = this.queryParams['typeId'];
      if (this.emailTypeId) {
        this.getEmailTemplatesById();
      }
    });

    this.userSub = this._authService.userInfo.subscribe(res => {
      if (res != null) {
        this.userInfo = res;
      }
    });

  }
  ngOnInit(): void {

  }
  filter() {
    if (Object.values(this.search.value).every(value => value !== null && value !== undefined && value !== '')) {
      this.queryParams = this.search.value;
    } else {
      this.queryParams = {}
    }
    this.router.navigate([], { queryParams: this.queryParams });
  }

  getEmailTypes(params = null) {
    const sub = this.emailTempalteService.getEmailTypes(this.userInfo?.role?.name == 'Admin' ? this.queryParams : {}).subscribe({
      next: (res) => {
        this.emailTypes = res['data'];
        this.getTypeId(this.emailTypes[0]._id);
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  getTypeId(id: string) {
    this.router.navigate([], { queryParams: { typeId: id } })
  }
  getEmailTemplatesById() {
    const sub = this.emailTempalteService.getEmailTemplatesById(this.emailTypeId).subscribe({
      next: (res) => {
        this.dataSource = res['data'];
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  createUpdateTemplate(itemId: string = '') {
    this.router.navigate([itemId ? 'email-templates/update/' + itemId : 'email-templates/add'], { queryParams: this.queryParams })
  }

  updateStatus(id: string) {
    const sub = this.emailTempalteService.updateStatus(id, this.emailTypeId).subscribe({
      next: (res) => {
        this.getEmailTemplatesById();
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  duplicateTemplate(id: string) {
    const sub = this.emailTempalteService.duplicateTemplate(id).subscribe({
      next: (res) => {
        this.getEmailTemplatesById();
        this.getEmailTypes();
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  deleteTemplate(id: string = '') {
    const isub = this.messageService
      .prompt(`Are you sure you want to delete this record?`)
      .afterClosed()
      .pipe(
        filter((_confirmed: boolean) => _confirmed),
        switchMap(() => {
          return this.emailTempalteService.deleteTemplate(id);
        })
      )
      .subscribe({
        next: (res) => {
          this.getEmailTemplatesById();
          this.getEmailTypes();
          isub.unsubscribe();
        },
        error: (res) => {
          isub.unsubscribe();
        },
      });
  }
  ngOnDestroy(): void {
    this.qSub.unsubscribe();
  }
}
