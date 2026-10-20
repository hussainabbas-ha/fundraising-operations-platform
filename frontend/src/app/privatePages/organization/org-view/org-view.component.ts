import { Component, OnDestroy, OnInit } from '@angular/core';
import { Group, Organization } from '../../../core/modals';
import { PaginationService } from '../../../_services/common/pagination.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { OrganizationService } from '../../../_services/dataServices/organization.service';
import { filter, Subscription, switchMap } from 'rxjs';
import { Pagination } from '../../../core/modals/pagination';
import { PaginationComponent } from '../../../core/pagination/pagination.component';
import { ImportModule } from '../../../core/import/import.module';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from '../../../_services/common/message.service';
import { SortService } from '../../../_services/common/sort.service';
import { GroupService } from '../../../_services/dataServices/group.service';
import { NewGroupComponent } from '../../group/new-group/new-group.component';
import { NewComponent } from '../new/new.component';

@Component({
  selector: 'app-org-view',
  standalone: true,
  imports: [PaginationComponent, ImportModule],
  templateUrl: './org-view.component.html',
  styleUrl: './org-view.component.scss'
})
export class OrgViewComponent implements OnInit, OnDestroy {
  data: Organization | undefined;
  imagePreview: string | undefined = '';
  pager: Pagination | any;
  queryParams: Params = {};
  dataSource: Group[] = [];
  selectedIndex: number = 0;
  routSub: Subscription;
  id: string = '';
  constructor(
    private pagination: PaginationService,
    private organizationService: OrganizationService,
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
      this.getOrganizationDetail(this.id);
    }
  }
  ngOnInit(): void {

  }

  getOrganizationDetail(id: string) {
    const sub = this.organizationService.getOrganizationDetail(id).subscribe({
      next: (res) => {
        this.data = res.data?.organization;
        this.imagePreview = this.data.logo
        this.dataSource = res.data?.groups;
        this.pager = this.pagination.compile(res.pagination);
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  createUpdateGroup(id: string = '') {
    const isMobile = window.innerWidth < 768;
    const DialogRef = this.dialog.open(NewGroupComponent, {
      data: { id: id },
      width: '80%',
      height: isMobile ? '70%' : '',
      disableClose: true,
    });
    const sub = DialogRef.afterClosed().subscribe((res) => {
      this.getOrganizationDetail(this.id);
      sub.unsubscribe();
    });
  }
  updateOrg() {
    const isMobile = window.innerWidth < 768;
    const DialogRef = this.dialog.open(NewComponent, {
      data: { id: this.id },
      width: '80%',
      height: isMobile ? '70%' : '',
      disableClose: true,
    });
    const sub = DialogRef.afterClosed().subscribe((res) => {
      this.getOrganizationDetail(this.id);
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
          this.getOrganizationDetail(this.id);
          isub.unsubscribe();
        },
        error: (res) => {
          isub.unsubscribe();
        },
      });
  }

  viewGroup(id: string) {
    this.router.navigate(['groups', id]);
  }
  deleteOrg() {
    const isub = this.messageService
      .prompt(`Are you sure you want to delete this record?`)
      .afterClosed()
      .pipe(
        filter((_confirmed: boolean) => _confirmed),
        switchMap(() => {
          return this.organizationService.deleteOrganization(this.id);
        })
      )
      .subscribe({
        next: (res) => {
          this.router.navigate(['/organizations'])
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
