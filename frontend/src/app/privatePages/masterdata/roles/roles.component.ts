import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Pagination } from '../../../core/modals/pagination';
import { filter, Subscription, switchMap } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Role, State } from '../../../core/modals';
import { PaginationService } from '../../../_services/common/pagination.service';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from '../../../_services/common/message.service';
import { ImportModule } from '../../../core/import/import.module';
import { PaginationComponent } from '../../../core/pagination/pagination.component';
import { RolesService } from '../../../_services/dataServices/roles.service';
import { Sort } from '@angular/material/sort';
import { SortService } from '../../../_services/common/sort.service';


@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [ImportModule, PaginationComponent],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss'
})
export class RolesComponent implements OnInit, OnDestroy {
  search: FormGroup;
  pager: Pagination | any;
  qSub: Subscription;
  queryParams: Params = {};
  dataSource: Role[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private pagination: PaginationService,
    private rolesService: RolesService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private sortService:SortService
  ) {
    this.search = this.formBuilder.group({
      q: ['']
    });
    this.qSub = this.route.queryParams.subscribe(res => {
      Object.assign(this.queryParams, res);
      this.getAllRoles();
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


  getAllRoles() {
    const sub = this.rolesService.getAllRoles(this.queryParams).subscribe({
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

  creatOrUpdateRole(id? :string){
    this.router.navigate([ id ? '/masterdata/roles/'+ id : '/masterdata/roles/add']);
  }

  deleteRole(id: string = '') {
    const isub = this.messageService
      .prompt(`Are you sure you want to delete this record?`)
      .afterClosed()
      .pipe(
        filter((_confirmed: boolean) => _confirmed),
        switchMap(() => {
          return this.rolesService.deleteRole(id);
        })
      )
      .subscribe({
        next: (res) => {
          this.getAllRoles();
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
