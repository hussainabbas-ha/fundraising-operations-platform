import { Component, OnDestroy, OnInit } from '@angular/core';
import { NewComponent } from './new/new.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Pagination } from '../../core/modals/pagination';
import { filter, Subscription, switchMap } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Vendor } from '../../core/modals';
import { PaginationService } from '../../_services/common/pagination.service';
import { VendorService } from '../../_services/dataServices/vendor.service';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from '../../_services/common/message.service';
import { ImportModule } from '../../core/import/import.module';
import { PaginationComponent } from '../../core/pagination/pagination.component';

@Component({
  selector: 'app-vendor',
  standalone: true,
  imports: [ImportModule, PaginationComponent],
  templateUrl: './vendor.component.html',
  styleUrl: './vendor.component.scss'
})
export class VendorComponent implements OnInit , OnDestroy{
  search: FormGroup;
    pager: Pagination | any;
    qSub: Subscription;
    queryParams: Params = {};
    dataSource: Vendor[] = [];
    constructor(
      private formBuilder: FormBuilder,
      private pagination: PaginationService,
      private vendorService: VendorService,
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
        this.getAllVendors();
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
   
  
    getAllVendors() {
      const sub = this.vendorService.getAllVendors(this.queryParams).subscribe({
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
  
    newDialog(id:string='') {
      const DialogRef = this.dialog.open(NewComponent, {
        data: { id: id },
        width: '80%',
        // height: '70%',
        disableClose: true,
      });
      const sub = DialogRef.afterClosed().subscribe((res) => {
        this.getAllVendors();
        sub.unsubscribe();
      });
    }
    deleteVendor(id: string = '') {
      const isub = this.messageService
        .prompt(`Are you sure you want to delete this record?`)
        .afterClosed()
        .pipe(
          filter((_confirmed: boolean) => _confirmed),
          switchMap(() => {
            return this.vendorService.deleteVendor(id);
          })
        )
        .subscribe({
          next: (res) => {
            this.getAllVendors();
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
