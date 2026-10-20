import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { filter, Subscription, switchMap } from 'rxjs';
import { Organization } from '../../core/modals';
import { Pagination } from '../../core/modals/pagination';
import { OrganizationService } from '../../_services/dataServices/organization.service';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from '../../_services/common/message.service';
import { SortService } from '../../_services/common/sort.service';
import { ImportModule } from '../../core/import/import.module';
import { PaginationComponent } from '../../core/pagination/pagination.component';
import { Sort } from '@angular/material/sort';
import { NewComponent } from './new/new.component';
import { PaginationService } from '../../_services/common/pagination.service';

@Component({
  selector: 'app-organization',
  standalone: true,
  imports: [ImportModule, PaginationComponent],
  templateUrl: './organization.component.html',
  styleUrl: './organization.component.scss'
})
export class OrganizationComponent implements OnInit, OnDestroy {
  search: FormGroup;
  pager: Pagination | any;
  qSub: Subscription;
  queryParams: Params = {};
  dataSource: Organization[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private pagination: PaginationService,
    private organizationService: OrganizationService,
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
      this.getAllOrganizations();
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


  getAllOrganizations() {
    const sub = this.organizationService.getAllOrganizations(this.queryParams).subscribe({
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
  view(id: string) {
    this.router.navigate(['organizations/detail/', id]);
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
      this.getAllOrganizations();
      sub.unsubscribe();
    });
  }
  deleteOrganization(id: string = '') {
    const isub = this.messageService
      .prompt(`Are you sure you want to delete this record? All the groups will be deleted!`)
      .afterClosed()
      .pipe(
        filter((_confirmed: boolean) => _confirmed),
        switchMap(() => {
          return this.organizationService.deleteOrganization(id);
        })
      )
      .subscribe({
        next: (res) => {
          this.getAllOrganizations();
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
      ['name'],
      this.dataSource
    );
  }

  ngOnDestroy(): void {
    this.qSub.unsubscribe();
  }
}
