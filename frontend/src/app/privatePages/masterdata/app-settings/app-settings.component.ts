import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { filter, Subscription, switchMap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { PaginationComponent } from '../../../core/pagination/pagination.component';
import { ImportModule } from '../../../core/import/import.module';
import { SettingsService } from '../../../_services/dataServices/settings.service';
import { Pagination } from '../../../core/modals/pagination';
import { AppSetting } from '../../../core/modals';
import { PaginationService } from '../../../_services/common/pagination.service';
import { SortService } from '../../../_services/common/sort.service';
import { NewComponent } from './new/new.component';


@Component({
  selector: 'app-app-settings',
  standalone: true,
  imports: [ImportModule , PaginationComponent],
  templateUrl: './app-settings.component.html',
  styleUrl: './app-settings.component.scss'
})
export class AppSettingsComponent implements OnInit ,OnDestroy {
 search: FormGroup;
  pager: Pagination | any;
  qSub: Subscription;
  queryParams: Params = {};
  dataSource: AppSetting[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private pagination: PaginationService,
    private settingsService: SettingsService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private sortService: SortService
  ) {
    this.search = this.formBuilder.group({
      q: ['']
    });
    this.qSub = this.route.queryParams.subscribe(res => {
      Object.assign(this.queryParams, res);
      this.getAllSettings();
    });
  }
  ngOnInit(): void {
    // this.newDialog()
  }

  filter() {
    if (Object.values(this.search.value).every(value => value !== null && value !== undefined && value !== '')) {
      this.queryParams = this.search.value;
    } else {
      this.queryParams = {}
    }
    this.router.navigate([], { queryParams: this.queryParams });
  }


  getAllSettings() {
    const sub = this.settingsService.getAllSettings(this.queryParams).subscribe({
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
      height: isMobile ? '70%' : '',
      disableClose: true,
    });
    const sub = DialogRef.afterClosed().subscribe((res) => {
      this.getAllSettings();
      sub.unsubscribe();
    });
  }

  sortData(sort: Sort) {
    this.dataSource = this.sortService.getSortedData(
      sort,
      ['firstName'],
      this.dataSource
    );
  }

  ngOnDestroy(): void {
    this.qSub.unsubscribe();
  }
}
