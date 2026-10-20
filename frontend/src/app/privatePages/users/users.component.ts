import { Component, OnDestroy, OnInit } from '@angular/core';
import { ImportModule } from '../../core/import/import.module';
import { PaginationComponent } from '../../core/pagination/pagination.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Pagination } from '../../core/modals/pagination';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { filter, Subscription, switchMap } from 'rxjs';
import { PaginationService } from '../../_services/common/pagination.service';
import { UserService } from '../../_services/dataServices/user.service';
import { User } from '../../core/modals';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from '../../_services/common/message.service';
import { NewComponent } from './new/new.component';
import { SortService } from '../../_services/common/sort.service';
import { Sort } from '@angular/material/sort';
import { InviteUserComponent } from '../invite-user/invite-user.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [ImportModule, PaginationComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit, OnDestroy {
  search: FormGroup;
  pager: Pagination | any;
  qSub: Subscription;
  queryParams: Params = {};
  dataSource: User[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private pagination: PaginationService,
    private userService: UserService,
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
      this.getAllUsers();
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


  getAllUsers() {
    const sub = this.userService.getAllUsers(this.queryParams).subscribe({
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
    const DialogRef = this.dialog.open(NewComponent, {
      data: { id: id },
      width: '80%',
      height: isMobile ? '70%' : '',
      disableClose: true,
    });
    const sub = DialogRef.afterClosed().subscribe((res) => {
      this.getAllUsers();
      sub.unsubscribe();
    });
  }

  view(id: string) {
    this.router.navigate(['/users', id]);
  }

  inviteUser() {
    const isMobile = window.innerWidth < 768;
    const DialogRef = this.dialog.open(InviteUserComponent, {
      data: { },
      width: '80%',
      height: isMobile ? '70%' : '',
      disableClose: true,
    });
    const sub = DialogRef.afterClosed().subscribe((res) => {
      this.getAllUsers();
      sub.unsubscribe();
    });
  }

  deleteUser(id: string = '') {
    const isub = this.messageService
      .prompt(`Are you sure you want to delete this record?`)
      .afterClosed()
      .pipe(
        filter((_confirmed: boolean) => _confirmed),
        switchMap(() => {
          return this.userService.deleteUser(id);
        })
      )
      .subscribe({
        next: (res) => {
          this.getAllUsers();
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
