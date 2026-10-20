import { Component, OnDestroy, OnInit, Optional } from '@angular/core';
import { ImportModule } from '../../../core/import/import.module';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PaginationComponent } from '../../../core/pagination/pagination.component';
import { Pagination } from '../../../core/modals/pagination';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PaginationService } from '../../../_services/common/pagination.service';
import { CountryService } from '../../../_services/dataServices/country.service';
import { Country } from '../../../core/modals';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NewComponent } from './new/new.component';
import { filter, Subscription, switchMap } from 'rxjs';
import { MessageService } from '../../../_services/common/message.service';

@Component({
  selector: 'app-country',
  standalone: true,
  imports: [ImportModule, PaginationComponent],
  templateUrl: './country.component.html',
  styleUrl: './country.component.scss'
})
export class CountryComponent implements OnInit, OnDestroy {
  search: FormGroup;
  pager: Pagination | any;
  qSub: Subscription;
  queryParams: Params = {};
  dataSource: Country[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private pagination: PaginationService,
    private countryService: CountryService,
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
      this.getAllCountries();
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
 

  getAllCountries() {
    const sub = this.countryService.getAllCountries(this.queryParams).subscribe({
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
      this.getAllCountries();
      sub.unsubscribe();
    });
  }
  deleteCountry(id: string = '') {
    const isub = this.messageService
      .prompt(`Are you sure you want to delete this record?`)
      .afterClosed()
      .pipe(
        filter((_confirmed: boolean) => _confirmed),
        switchMap(() => {
          return this.countryService.deleteCountry(id);
        })
      )
      .subscribe({
        next: (res) => {
          this.getAllCountries();
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
