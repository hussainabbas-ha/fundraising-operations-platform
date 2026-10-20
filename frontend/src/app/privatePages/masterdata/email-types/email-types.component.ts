import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ImportModule } from '../../../core/import/import.module';
import { PaginationComponent } from '../../../core/pagination/pagination.component';
import { Pagination } from '../../../core/modals/pagination';
import { filter, Subscription, switchMap } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MessageService } from '../../../_services/common/message.service';
import { MatDialog } from '@angular/material/dialog';
import { PaginationService } from '../../../_services/common/pagination.service';
import { NewComponent } from './new/new.component';
import { EmailType, lookupData } from '../../../core/modals';
import { EmailTypeService } from '../../../_services/dataServices/emailType.service';
import { LbAutoCompleteComponent } from '../../../core/lb-auto-complete/lb-auto-complete.component';
import { LookupService } from '../../../_services/dataServices/lookup.service';

@Component({
  selector: 'app-email-types',
  standalone: true,
  imports: [ImportModule, PaginationComponent, LbAutoCompleteComponent],
  templateUrl: './email-types.component.html',
  styleUrl: './email-types.component.scss'
})
export class EmailTypesComponent implements OnInit, OnDestroy {
  search: FormGroup;
  pager: Pagination | any;
  qSub: Subscription;
  queryParams: Params = {};
  dataSource: EmailType[] = [];
  selectCompany: lookupData[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private pagination: PaginationService,
    private emailTypeService: EmailTypeService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private messageService: MessageService,
    private lookupService: LookupService
  ) {
    this.search = this.formBuilder.group({
      q: [''],
      companyId: ['']
    });
    this.qSub = this.route.queryParams.subscribe(res => {
      Object.assign(this.queryParams, res);
      if (this.queryParams['companyId'] == '') {
        delete this.queryParams['companyId'];
        this.router.navigate([], {
          queryParams: { ...this.queryParams },
        });
      }
      this.getAllTypes(this.queryParams);
    });
    this.getCompanyLookup();
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


  getAllTypes(params: Params) {
    const sub = this.emailTypeService.getAllTypes(params).subscribe({
      next: (res) => {
        this.dataSource = res.data;
        this.pager = this.pagination.compile(res.pagination);
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  getCompanyLookup() {
    const sub = this.lookupService.getCompanyLookup().subscribe({
      next: (res) => {
        this.selectCompany = res.data;
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  newDialog(id: string = '') {
    const DialogRef = this.dialog.open(NewComponent, {
      data: { id: id },
      width: '80%',
      // height: '70%',
      disableClose: true,
    });
    const sub = DialogRef.afterClosed().subscribe((res) => {
      this.getAllTypes(this.queryParams);
      sub.unsubscribe();
    });
  }

  getFilteredData(event: any) {
    this.router.navigate([], { queryParams: { companyId: event } })
  }

  ngOnDestroy(): void {
    this.qSub.unsubscribe();
  }
}
