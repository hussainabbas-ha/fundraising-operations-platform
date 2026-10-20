import { Component, OnDestroy, OnInit } from '@angular/core';
import { Company, Organization } from '../../../core/modals';
import { PaginationService } from '../../../_services/common/pagination.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { filter, Subscription, switchMap } from 'rxjs';
import { Pagination } from '../../../core/modals/pagination';
import { PaginationComponent } from '../../../core/pagination/pagination.component';
import { ImportModule } from '../../../core/import/import.module';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from '../../../_services/common/message.service';
// import { NewComponent } from '../../organization/new/new.component';
import { NewComponent } from '../new/new.component';
import { CompanyService } from '../../../_services/dataServices/company.service';
import { OrganizationService } from '../../../_services/dataServices/organization.service';

@Component({
  selector: 'app-company-view',
  standalone: true,
  imports: [ImportModule, PaginationComponent],
  templateUrl: './company-view.component.html',
  styleUrl: './company-view.component.scss'
})
export class CompanyViewComponent implements OnInit, OnDestroy {
  data: Company | undefined;
  imagePreview: string | undefined = '';
  pager: Pagination | any;
  queryParams: Params = {};
  dataSource: Organization[] = [];
  selectedIndex: number = 0;
  routSub: Subscription;
  id: string = '';
  constructor(
    private pagination: PaginationService,
    private companyService: CompanyService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private messageService: MessageService,
) {
    this.routSub = this.route.params.subscribe(params => {
      this.id = params['id'];
    });
    if (this.id && this.id != '') {
      this.getCompanyDetail(this.id);
    }
  }
  ngOnInit(): void {

  }

  getCompanyDetail(id: string) {
    const sub = this.companyService.getCompanyDetail(id).subscribe({
      next: (res) => {
        this.data = res.data?.company;
        this.imagePreview = this.data.logo;
        this.dataSource = res.data?.organizations;
        this.pager = this.pagination.compile(res.pagination);
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  updateCompany() {
    const isMobile = window.innerWidth < 768;
    const DialogRef = this.dialog.open(NewComponent, {
      data: { id: this.id },
      width: '80%',
      height: isMobile ? '70%' : '',
      disableClose: true,
    });
    const sub = DialogRef.afterClosed().subscribe((res) => {
      this.getCompanyDetail(this.id);
      sub.unsubscribe();
    });
  }
  deleteCompany() {
    const isub = this.messageService
      .prompt(`Are you sure you want to delete this record?`)
      .afterClosed()
      .pipe(
        filter((_confirmed: boolean) => _confirmed),
        switchMap(() => {
          return this.companyService.deleteCompany(this.id);
        })
      )
      .subscribe({
        next: (res) => {
          this.router.navigate(['/companies'])
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
