import { Component, OnDestroy, OnInit } from '@angular/core';
import { ImportModule } from '../../core/import/import.module';
import { PaginationComponent } from '../../core/pagination/pagination.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Pagination } from '../../core/modals/pagination';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { filter, Subscription, switchMap } from 'rxjs';
import { PaginationService } from '../../_services/common/pagination.service';
import { Company, User } from '../../core/modals';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from '../../_services/common/message.service';
import { NewComponent } from './new/new.component';
import { SortService } from '../../_services/common/sort.service';
import { Sort } from '@angular/material/sort';
import { CompanyService } from '../../_services/dataServices/company.service';
import { InviteUserComponent } from '../invite-user/invite-user.component';
@Component({
  selector: 'app-company',
  standalone: true,
  imports: [ImportModule, PaginationComponent],
  templateUrl: './company.component.html',
  styleUrl: './company.component.scss'
})
export class CompanyComponent implements OnInit, OnDestroy {
  search: FormGroup;
  pager: Pagination | any;
  qSub: Subscription;
  queryParams: Params = {};
  dataSource: Company[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private pagination: PaginationService,
    private companyService: CompanyService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private messageService: MessageService,
    private sortService: SortService
  ) {
    this.search = this.formBuilder.group({
      q: ['']
    });
    this.qSub = this.route.queryParams.subscribe(res => {
      Object.assign(this.queryParams, res);
      this.getAllCompanies();
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


  getAllCompanies() {
    const sub = this.companyService.getAllCompanies(this.queryParams).subscribe({
      next: (res) => {
        this.dataSource = res['data'];
        this.pager = this.pagination.compile(res.pagination);
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  view(id: string) {
    this.router.navigate(['company/detail/', id]);
  }

  newDialog(id: string = '') {
    const isMobile = window.innerWidth < 768;
    const DialogRef = this.dialog.open(NewComponent, {
      data: { id: id },
      width: '80%',
      height: isMobile ? '70%' : '',
      disableClose: true,
    });
    const sub = DialogRef.afterClosed().subscribe((res) => {
      this.getAllCompanies();
      sub.unsubscribe();
    });
  }

  inviteUser(id: string) {
    const isMobile = window.innerWidth < 768;
    const DialogRef = this.dialog.open(InviteUserComponent, {
      data: { id: id },
      width: '80%',
      height: isMobile ? '70%' : '',
      disableClose: true,
    });
    const sub = DialogRef.afterClosed().subscribe((res) => {
      this.getAllCompanies();
      sub.unsubscribe();
    });
  }

  createTemplate(id: string) {
    const sub = this.companyService.createTemplate(id).subscribe({
      next: (res) => {
        this.getAllCompanies();
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  deleteCompany(id: string = '') {
    const isub = this.messageService
      .prompt(`Are you sure you want to delete this record?`)
      .afterClosed()
      .pipe(
        filter((_confirmed: boolean) => _confirmed),
        switchMap(() => {
          return this.companyService.deleteCompany(id);
        })
      )
      .subscribe({
        next: (res) => {
          this.getAllCompanies();
          isub.unsubscribe();
        },
        error: (res) => {
          isub.unsubscribe();
        },
      });
  }
  sortData(sort: Sort) {
    this.dataSource = this.sortService.getSortedData(
      sort,
      ['firstName'],
      this.dataSource
    );
  }

  ngOnDestroy(): void {
    this.qSub.unsubscribe();
  }
}
