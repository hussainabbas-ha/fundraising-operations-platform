import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Pagination } from '../../core/modals/pagination';
import { filter, Subscription, switchMap } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Group } from '../../core/modals';
import { PaginationService } from '../../_services/common/pagination.service';
import { GroupService } from '../../_services/dataServices/group.service';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from '../../_services/common/message.service';
import { SortService } from '../../_services/common/sort.service';
import { Sort } from '@angular/material/sort';
import { ImportModule } from '../../core/import/import.module';
import { PaginationComponent } from '../../core/pagination/pagination.component';
import { NewGroupComponent } from './new-group/new-group.component';


@Component({
  selector: 'app-group',
  standalone: true,
  imports: [ImportModule, PaginationComponent],
  templateUrl: './group.component.html',
  styleUrl: './group.component.scss'
})
export class GroupComponent implements OnInit, OnDestroy {
  search: FormGroup;
  pager: Pagination | any;
  qSub: Subscription;
  queryParams: Params = {};
  dataSource: Group[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private pagination: PaginationService,
    private groupService: GroupService,
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
      this.getAllGroups();
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
  view(id: string) {
    this.router.navigate(['groups/', id]);
  }

  getAllGroups() {
    const sub = this.groupService.getAllGroups(this.queryParams).subscribe({
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

  newDialog(id: string = '') {
    const isMobile = window.innerWidth < 768;
    const DialogRef = this.dialog.open(NewGroupComponent, {
      data: { id: id },
      width: '80%',
      height: isMobile ? '70%' : '',
      disableClose: true,
    });
    const sub = DialogRef.afterClosed().subscribe((res) => {
      this.getAllGroups();
      sub.unsubscribe();
    });
  }
  deleteGroup(id: string = '') {
    const isub = this.messageService
      .prompt(`Are you sure you want to delete this record?`)
      .afterClosed()
      .pipe(
        filter((_confirmed: boolean) => _confirmed),
        switchMap(() => {
          return this.groupService.deleteGroup(id);
        })
      )
      .subscribe({
        next: (res) => {
          this.getAllGroups();
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
