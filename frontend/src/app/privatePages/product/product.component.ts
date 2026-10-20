import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Pagination } from '../../core/modals/pagination';
import { filter, Subscription, switchMap } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Product } from '../../core/modals';
import { ProductService } from '../../_services/dataServices/product.service';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from '../../_services/common/message.service';
import { SortService } from '../../_services/common/sort.service';
import { PaginationService } from '../../_services/common/pagination.service';
import { NewComponent } from './new/new.component';
import { PaginationComponent } from '../../core/pagination/pagination.component';
import { ImportModule } from '../../core/import/import.module';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [ImportModule, PaginationComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit, OnDestroy{
  search: FormGroup;
    pager: Pagination | any;
    qSub: Subscription;
    queryParams: Params = {};
    dataSource: Product[] = [];
    constructor(
      private formBuilder: FormBuilder,
      private pagination: PaginationService,
      private productService: ProductService,
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
        this.getAllProducts();
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
    getAllProducts() {
      const sub = this.productService.getAllProducts(this.queryParams).subscribe({
        next: (res) => {
          this.dataSource = res['data'];
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
        height: '77%',
        disableClose: true,
      });
      const sub = DialogRef.afterClosed().subscribe((res) => {
        this.getAllProducts();
        sub.unsubscribe();
      });
    }
    deleteProduct(id: string = '') {
      const isub = this.messageService
        .prompt(`Are you sure you want to delete this record?`)
        .afterClosed()
        .pipe(
          filter((_confirmed: boolean) => _confirmed),
          switchMap(() => {
            return this.productService.deleteProduct(id);
          })
        )
        .subscribe({
          next: (res) => {
            this.getAllProducts();
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
