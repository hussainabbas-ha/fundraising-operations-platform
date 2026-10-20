import { Component, OnDestroy, OnInit } from '@angular/core';
import { filter, Subscription, switchMap } from 'rxjs';
import { ImportModule } from '../../core/import/import.module';
import { PaginationComponent } from '../../core/pagination/pagination.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Pagination } from '../../core/modals/pagination';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DripCampaign } from '../../core/modals';
import { DripCampaignService } from '../../_services/dataServices/dripCampaign.service';
import { PaginationService } from '../../_services/common/pagination.service';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from '../../_services/common/message.service';
import { NewComponent } from './new/new.component';

@Component({
  selector: 'app-drip-campaign',
  standalone: true,
  imports: [ImportModule, PaginationComponent],
  templateUrl: './drip-campaign.component.html',
  styleUrl: './drip-campaign.component.scss'
})
export class DripCampaignComponent implements OnInit, OnDestroy{
   search: FormGroup;
    pager: Pagination | any;
    qSub: Subscription;
    queryParams: Params = {};
    dataSource: DripCampaign[] = [];
    constructor(
      private formBuilder: FormBuilder,
      private pagination: PaginationService,
      private dripCampaign: DripCampaignService,
      private route: ActivatedRoute,
      private router: Router,
      private dialog: MatDialog,
      private messageService:MessageService
    ) {
      this.search = this.formBuilder.group({
        q: ['']
      });
      this.qSub = this.route.queryParams.subscribe(res => {
        Object.assign(this.queryParams, res);
        this.getAllDripCampaigns();
      });
    }
    ngOnInit(): void {
    }
  
    filter() {
      if(Object.values(this.search.value).every(value => value !== null && value !== undefined && value !== '')){
        this.queryParams = this.search.value;
      }else{
        this.queryParams={}
      }
      this.router.navigate([], { queryParams: this.queryParams });
    }
   
  
    getAllDripCampaigns() {
      const sub = this.dripCampaign.getAllDripCampaigns(this.queryParams).subscribe({
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
          this.getAllDripCampaigns();
          sub.unsubscribe();
        });
      }
    deleteDripCampaign(id: string = '') {
      const isub = this.messageService
        .prompt(`Are you sure you want to delete this record?`)
        .afterClosed()
        .pipe(
          filter((_confirmed: boolean) => _confirmed),
          switchMap(() => {
            return this.dripCampaign.deleteDripCampaign(id);
          })
        )
        .subscribe({
          next: (res) => {
            this.getAllDripCampaigns();
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
