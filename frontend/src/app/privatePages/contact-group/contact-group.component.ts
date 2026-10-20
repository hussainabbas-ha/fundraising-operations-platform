import { Component, OnDestroy, OnInit } from '@angular/core';
import { Pagination } from '../../core/modals/pagination';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PaginationService } from '../../_services/common/pagination.service';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from '../../_services/common/message.service';
import { ContactGroup } from '../../core/modals';
import { PaginationComponent } from '../../core/pagination/pagination.component';
import { ImportModule } from '../../core/import/import.module';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { filter, Subscription, switchMap } from 'rxjs';
import { AddContactGroupComponent } from './add-contact-group/add-contact-group.component';
import { ContactGroupService } from '../../_services/dataServices/contactGroup.service';


@Component({
  selector: 'app-contact-group',
  standalone: true,
  imports: [ImportModule, PaginationComponent],
  templateUrl: './contact-group.component.html',
  styleUrl: './contact-group.component.scss'
})
export class ContactGroupComponent implements OnInit , OnDestroy{
search: FormGroup;
  pager: Pagination | any;
  dataSource: ContactGroup[] = [];
  queryParams: Params = {};
  qSub: Subscription;
  constructor(
    private formBuilder: FormBuilder,
    private pagination: PaginationService,
    private contactGroupService: ContactGroupService,
    private dialog: MatDialog,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.search = this.formBuilder.group({
      q: ['']
    });
    this.qSub = this.route.queryParams.subscribe(res => {
      Object.assign(this.queryParams, res);
      this.getAllContactsGroups();
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


  getAllContactsGroups() {
    const sub = this.contactGroupService.getAllContactsGroup(this.queryParams).subscribe({
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


  createOrUpdate(id: string = '') {
    const isMobile = window.innerWidth < 768;
    const DialogRef = this.dialog.open(AddContactGroupComponent, {
      data: { id: id },
      width: '80%',
      // height: '68%',
      disableClose: true,
    });
    const sub = DialogRef.afterClosed().subscribe((res) => {
      this.getAllContactsGroups();
      sub.unsubscribe();
    });
  }

  deleteContactGroup(id: string = '') {
    const isub = this.messageService
      .prompt(`Are you sure you want to delete this record?`)
      .afterClosed()
      .pipe(
        filter((_confirmed: boolean) => _confirmed),
        switchMap(() => {
          return this.contactGroupService.deleteContactGroup(id);
        })
      )
      .subscribe({
        next: (res) => {
          this.getAllContactsGroups();
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
