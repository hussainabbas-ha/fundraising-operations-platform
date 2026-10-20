import { FormBuilder, FormGroup } from "@angular/forms";
import { PaginationService } from "../../../_services/common/pagination.service";
import { ImportModule } from "../../../core/import/import.module";
import { Pagination } from "../../../core/modals/pagination";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { filter, Subscription, switchMap } from "rxjs";
import { Region } from "../../../core/modals";
import { RegionService } from "../../../_services/dataServices/region.service";
import { MatDialog } from "@angular/material/dialog";
import { MessageService } from "../../../_services/common/message.service";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { NewComponent } from "./new/new.component";
import { PaginationComponent } from "../../../core/pagination/pagination.component";


@Component({
  selector: 'app-region',
  standalone: true,
  imports: [ImportModule,PaginationComponent],
  templateUrl: './region.component.html',
  styleUrl: './region.component.scss'
})
export class RegionComponent implements OnInit, OnDestroy {
 search: FormGroup;
  pager: Pagination | any;
  qSub: Subscription;
  queryParams: Params = {};
  dataSource: Region[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private pagination: PaginationService,
    private regionService: RegionService,
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
      this.getAllRegions();
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
 

  getAllRegions() {
    const sub = this.regionService.getAllRegions(this.queryParams).subscribe({
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
      this.getAllRegions();
      sub.unsubscribe();
    });
  }
  deleteRegion(id: string = '') {
    const isub = this.messageService
      .prompt(`Are you sure you want to delete this record?`)
      .afterClosed()
      .pipe(
        filter((_confirmed: boolean) => _confirmed),
        switchMap(() => {
          return this.regionService.deleteRegion(id);
        })
      )
      .subscribe({
        next: (res) => {
          this.getAllRegions();
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

