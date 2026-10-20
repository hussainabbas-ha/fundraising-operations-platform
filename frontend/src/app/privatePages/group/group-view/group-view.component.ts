import { Component, OnDestroy, OnInit } from '@angular/core';
import { Group } from '../../../core/modals';
import { Pagination } from '../../../core/modals/pagination';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { filter, Subscription, switchMap } from 'rxjs';
import { PaginationService } from '../../../_services/common/pagination.service';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from '../../../_services/common/message.service';
import { SortService } from '../../../_services/common/sort.service';
import { GroupService } from '../../../_services/dataServices/group.service';
import { NewGroupComponent } from '../new-group/new-group.component';
import { PaginationComponent } from '../../../core/pagination/pagination.component';
import { ImportModule } from '../../../core/import/import.module';

@Component({
  selector: 'app-group-view',
  standalone: true,
  imports: [ImportModule, PaginationComponent],
  templateUrl: './group-view.component.html',
  styleUrl: './group-view.component.scss'
})
export class GroupViewComponent implements OnInit, OnDestroy {
  data: Group | undefined;
  imagePreview: string | undefined = '';
  coverImages: string | undefined = '';
  pager: Pagination | any;
  queryParams: Params = {};
  dataSource: Group[] = [];
  selectedIndex: number = 0;
  routSub: Subscription;
  id: string = '';
  constructor(
    private pagination: PaginationService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private messageService: MessageService,
    private sortService: SortService,
    private groupService: GroupService
  ) {
    this.routSub = this.route.params.subscribe(params => {
      this.id = params['id'];
    });
    if (this.id && this.id != '') {
      this.getSingleGroup(this.id);
    }
  }
  ngOnInit(): void {

  }

  getSingleGroup(id: string) {
    const sub = this.groupService.getSingleGroup(id).subscribe({
      next: (res) => {
        this.data = res.data;
        this.imagePreview = this.data?.logo ? this.data?.logo : '';
        this.coverImages = this.data?.coverImage ? this.data?.coverImage : '';
        // this.pager = this.pagination.compile(res.pagination);
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  updateGroup() {
    const isMobile = window.innerWidth < 768;
    const DialogRef = this.dialog.open(NewGroupComponent, {
      data: { id: this.id },
      width: '80%',
      height: isMobile ? '70%' : '',
      disableClose: true,
    });
    const sub = DialogRef.afterClosed().subscribe((res) => {
      this.getSingleGroup(this.id);
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
          // this.getAllGroups();
          isub.unsubscribe();
        },
        error: (res) => {
          isub.unsubscribe();
        },
      });
  }

  ngOnDestroy(): void {
    this.routSub.unsubscribe();
  }
}

