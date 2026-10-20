import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Pagination } from '../../core/modals/pagination';
import { filter, Subscription, switchMap } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Campaign } from '../../core/modals';
import { PaginationService } from '../../_services/common/pagination.service';
import { CampaignService } from '../../_services/dataServices/campaign.service';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from '../../_services/common/message.service';
import { ImportModule } from '../../core/import/import.module';
import { PaginationComponent } from '../../core/pagination/pagination.component';

@Component({
  selector: 'app-campagin',
  standalone: true,
  imports: [ImportModule, PaginationComponent],
  templateUrl: './campagin.component.html',
  styleUrl: './campagin.component.scss'
})
export class CampaginComponent implements OnInit, OnDestroy {
  search: FormGroup;
  pager: Pagination | any;
  qSub: Subscription;
  queryParams: Params = {};
  dataSource: Campaign[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private pagination: PaginationService,
    private campaignService: CampaignService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private messageService: MessageService
  ) {
    this.search = this.formBuilder.group({
      q: ['']
    });
    this.qSub = this.route.queryParams.subscribe(res => {
      Object.assign(this.queryParams, res);
      this.getAllCampaigns();
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


  getAllCampaigns() {
    const sub = this.campaignService.getAllCampaigns(this.queryParams).subscribe({
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
    this.router.navigate(['/campaigns/' + (id !== '' ? id : 'add')]);
  }

  view(id: string) {
    this.router.navigate(['campaigns/detail/', id]);
  }
  
  deleteCampaign(id: string = '') {
    const isub = this.messageService
      .prompt(`Are you sure you want to delete this record?`)
      .afterClosed()
      .pipe(
        filter((_confirmed: boolean) => _confirmed),
        switchMap(() => {
          return this.campaignService.deleteCampaign(id);
        })
      )
      .subscribe({
        next: (res) => {
          this.getAllCampaigns();
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
