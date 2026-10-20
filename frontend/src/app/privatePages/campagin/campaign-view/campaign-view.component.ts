import { Component, OnDestroy, OnInit } from '@angular/core';
import { Campaign, CampaignMembers, CampaignProduct, Product } from '../../../core/modals';
import { Pagination } from '../../../core/modals/pagination';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { filter, Subscription, switchMap } from 'rxjs';
import { CampaignService } from '../../../_services/dataServices/campaign.service';
import { PaginationService } from '../../../_services/common/pagination.service';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from '../../../_services/common/message.service';
import { NewCampaignComponent } from '../new-campaign/new-campaign.component';
import { ImportModule } from '../../../core/import/import.module';
import { PaginationComponent } from '../../../core/pagination/pagination.component';

@Component({
  selector: 'app-campaign-view',
  standalone: true,
  imports: [ImportModule, PaginationComponent],
  templateUrl: './campaign-view.component.html',
  styleUrl: './campaign-view.component.scss'
})
export class CampaignViewComponent implements OnInit {
  data: Campaign | undefined;
  imagePreview: string | undefined = '';
  coverPreview: string | undefined = '';
  pager: Pagination | any;
  queryParams: Params = {};
  membersData: CampaignMembers[] = [];
  productData: CampaignProduct [] = [];
  campaignProducts: Product[] = [];
  goalsData: any;
  selectedIndex: number = 0;
  routSub: Subscription;
  id: string = '';
  constructor(
    private pagination: PaginationService,
    private campaignService: CampaignService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private messageService: MessageService,
  ) {
    this.routSub = this.route.params.subscribe(params => {
      this.id = params['id'];
    });
    if (this.id && this.id != '') {
      this.getCampaignDetail(this.id);
    }
  }
  ngOnInit(): void {

  }

  getCampaignDetail(id: string) {
    const sub = this.campaignService.getCampaignDetail(id).subscribe({
      next: (res) => {
        this.data = res.data?.campaign;
        this.membersData = res.data?.members;
        this.goalsData = this.data?.goals;
        this.campaignProducts = this.data?.products?.campaignProducts;
        this.coverPreview = this.data?.groupCover;
        this.imagePreview= this.data.organizationlogo;
        // this.imagePreview = this.data
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
  
  deleteCampaign() {
    const isub = this.messageService
      .prompt(`Are you sure you want to delete this record?`)
      .afterClosed()
      .pipe(
        filter((_confirmed: boolean) => _confirmed),
        switchMap(() => {
          return this.campaignService.deleteCampaign(this.id);
        })
      )
      .subscribe({
        next: (res) => {
          this.router.navigate(['/campaigns'])
          isub.unsubscribe();
        },
        error: (res) => {
          isub.unsubscribe();
        },
      });
  }
}