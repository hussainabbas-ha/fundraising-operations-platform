import { Component, OnDestroy, OnInit } from '@angular/core';
import { LbAutoCompleteComponent } from '../../../core/lb-auto-complete/lb-auto-complete.component';
import { DatePickerComponent } from '../../../core/date-picker/date-picker.component';
import { VMessageComponent } from '../../../core/v-message/v-message.component';
import { ImportModule } from '../../../core/import/import.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { lookupData, User } from '../../../core/modals';
import { Subscription } from 'rxjs';
import { changeDateToApiFormat } from '../../../core/utility';
import { LookupService } from '../../../_services/dataServices/lookup.service';
import { CampaignService } from '../../../_services/dataServices/campaign.service';
import { AuthService } from '../../../_services/common/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { NewComponent } from '../../organization/new/new.component';
import { NewGroupComponent } from '../../group/new-group/new-group.component';
import { InviteComponent } from '../invite/invite.component';

@Component({
  selector: 'app-new-campaign',
  standalone: true,
  imports: [ImportModule, VMessageComponent, LbAutoCompleteComponent, DatePickerComponent],
  templateUrl: './new-campaign.component.html',
  styleUrl: './new-campaign.component.scss'
})
export class NewCampaignComponent implements OnInit, OnDestroy {
  step1: FormGroup;
  step2: FormGroup;
  step3: FormGroup;
  step4: FormGroup;
  _id: string = '';
  form: FormGroup;
  selectCompany: lookupData[] = [];
  selectGroup: lookupData[] = [];
  selectOrganization: lookupData[] = [];
  selectStatus: lookupData[] = [];
  selectYear: lookupData[] = [];
  selectLeader: lookupData[] = [];
  selectSeasons: lookupData[] = [];
  selectProductType: lookupData[] = [];
  selectProduct: lookupData[] = [];
  selectVendor: lookupData[] = [];
  userInfo: User | undefined;
  userSub: Subscription;
  routSub: Subscription | null;
  id: string = '';
  products: any[] = [];
  subProducts: any[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private campaignService: CampaignService,
    private _authService: AuthService,
    private route: ActivatedRoute,
    private lookupService: LookupService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.routSub = this.route.params.subscribe(params => {
      this.id = params['id'];
      if (this.id && this.id != '') {
        this.getSingleCampaign(this.id);
      }
    });
    this.userSub = this._authService.userInfo.subscribe(res => {
      if (res != null) {
        this.userInfo = res;
      }
    });

    this.step1 = this.form = this.formBuilder.group({
      title: ['', Validators.required],
      season: ['', Validators.required],
      ccFees: ['', Validators.required],
      year: ['', Validators.required,],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      groupId: ['', Validators.required],
      organizationId: ['', Validators.required],
      leaderId: ['', Validators.required],
    });

    this.step2 = this.formBuilder.group({
      productType: ['physical', [Validators.required]],
      productIds: [''],
      vendorIds: [''],
      minAmount: [''],
      greatDonation: [''],
      greatDonationSwitch: [false],
      amazingDonation: [''],
      amazingDonationSwitch: [false],
      spectacularDonation: [''],
      spectacularDonationSwitch: [false],
      allStarDonation: [''],
      allStarDonationSwitch: [false],
      gameChangerDonation: [''],
      gameChangerDonationSwitch: [false],
      championDonation: [''],
      championDonationSwitch: [false],
    });

    this.step3 = this.formBuilder.group({
      expectedParticipant: ['', [Validators.required]],
      participantGoal: ['', [Validators.required]],
      groupGoal: ['', [Validators.required]],
      percentageToGroup: ['', [Validators.required]],
      message: ['', [Validators.required]],
    });

    this.step4 = this.formBuilder.group({
      dripStartDate: ['', [Validators.required]],
      isEmail: [true],
      isText: [true],
    });

    if (this.userInfo?.companyId) {
      this.getOrganizationLookup(this.userInfo?.companyId);
    }
    this.getCampaiognSeasonsLookup();
    this.getProductTypeLookup();
    this.getVendorsLookup();
    const currentYear = new Date().getFullYear();
    const year = Array.from({ length: 5 }, (_, i) => {
      const year = currentYear + i;
      this.selectYear.push({
        name: year.toString(),
        value: year.toString()
      });
    });

  }

  ngOnInit(): void {
  }


  getSingleCampaign(id: string) {
    const sub = this.campaignService.getSingleCampaign(id).subscribe({
      next: (res) => {
        let data = res['data'];
        let convertedProducts: any[] = [];
        let convertedVendors: any[] = [];
        data?.products?.campaignProducts.forEach((x) => {
          if (x?.productType == 'physical') {
            convertedProducts.push(x._id);
            convertedVendors.push(x.vendorId);
          }
          if (x?.productType == 'digital') {
            x?.products?.forEach((x) => {
              const formSwitch = this.switchValue(x.title, false);
              const title = String(formSwitch).replace("Switch", "");
              this.step2.patchValue({
                [formSwitch]: x.isEnabled,
                [title]: x.amount
              })
              this.subProducts.push(x)
            });
          }
        });
        this.getLeaderLookup(data.organizationId);
        this.getGroupLookup(data.organizationId);
        this.getProductLookup(convertedVendors);
        this.step1.patchValue({
          title: data.title ? data.title : '',
          season: data.season ? data.season : '',
          ccFees: data.ccFees ? data.ccFees : '',
          year: data.year ? data.year : '',
          startDate: data.startDate ? data.startDate : '',
          endDate: data.endDate ? data.endDate : '',
          groupId: data.groupId ? data.groupId : '',
          organizationId: data.organizationId ? data.organizationId : '',
          leaderId: data.leaderId ? data.leaderId : '',
        });

        this.step2.patchValue({
          productType: data?.productType ? data?.productType : 'physical',
          productIds: convertedProducts,
          vendorIds: convertedVendors,
        });

        this.step4.patchValue({
          dripStartDate: data?.drip?.startDate ? data?.drip?.startDate : '',
          isEmail: data?.drip?.isEmail ? data?.drip?.isEmail : false,
          isText: data?.drip?.isText ? data?.drip?.isText : false,
        });

        this.step3.patchValue({
          expectedParticipant: data?.goals?.expectedParticipant ? data?.goals?.expectedParticipant : '',
          participantGoal: data?.goals?.participantGoal ? data?.goals?.participantGoal : '',
          groupGoal: data?.goals?.groupGoal ? data?.goals?.groupGoal : '',
          message: data?.goals?.message ? data?.goals?.message : '',
          percentageToGroup: data?.products?.percentageToGroup ? data?.products?.percentageToGroup : ''
        });

        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  getGroupLookup(event: any) {
    const sub = this.lookupService.getGroupLookup({ organizationId: event }).subscribe({
      next: (res) => {
        this.selectGroup = res['data'];
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  getOrganizationLookup(event: any) {
    const sub = this.lookupService.getOrganizationLookup({ companyId: event }).subscribe({
      next: (res) => {
        this.selectOrganization = res['data'];
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  getLeaderLookup(event: any) {
    const sub = this.lookupService.getLeaderLookup({ organizationId: event }).subscribe({
      next: (res) => {
        this.selectLeader = res['data'];
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  getProductTypeLookup() {
    const sub = this.lookupService.getProductTypeLookup().subscribe({
      next: (res) => {
        this.selectProductType = res['data'];
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  getVendorsLookup() {
    const sub = this.lookupService.getVendorsLookup().subscribe({
      next: (res) => {
        this.selectVendor = res['data'];
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  getProductLookup(event: any) {
    const sub = this.lookupService.getProductLookup({ vendorId: event }).subscribe({
      next: (res) => {
        this.selectProduct = res['data'];
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  getCampaiognSeasonsLookup() {
    const sub = this.lookupService.getCampaiognSeasonsLookup().subscribe({
      next: (res) => {
        this.selectSeasons = res['data'];
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  newOrg(id: string = '') {
    const isMobile = window.innerWidth < 768;
    const DialogRef = this.dialog.open(NewComponent, {
      data: { id: id },
      width: '80%',
      height: isMobile ? '70%' : '',
      disableClose: true,
    });
    const sub = DialogRef.afterClosed().subscribe((res) => {
      this.getOrganizationLookup(this.userInfo?.companyId);
      sub.unsubscribe();
    });
  }

  invite(id: string = '') {
    const isMobile = window.innerWidth < 768;
    const DialogRef = this.dialog.open(InviteComponent, {
      data: { orgId: this.form.value.organizationId },
      width: '80%',
      height: isMobile ? '70%' : '',
      disableClose: true,
    });
    const sub = DialogRef.afterClosed().subscribe((res) => {
      this.getLeaderLookup(this.form.value.organizationId);
      sub.unsubscribe();
    });
  }

  newGroup(id: string = '') {
    const isMobile = window.innerWidth < 768;
    const DialogRef = this.dialog.open(NewGroupComponent, {
      data: { id: id },
      width: '80%',
      height: isMobile ? '70%' : '',
      disableClose: true,
    });
    const sub = DialogRef.afterClosed().subscribe((res) => {
      this.getGroupLookup(this.form.value.organizationId);
      sub.unsubscribe();
    });
  }

  newUser(id: string = '') {
    const isMobile = window.innerWidth < 768;
    const DialogRef = this.dialog.open(NewGroupComponent, {
      data: { id: id },
      width: '80%',
      height: isMobile ? '70%' : '',
      disableClose: true,
    });
    const sub = DialogRef.afterClosed().subscribe((res) => {

      sub.unsubscribe();
    });
  }

  checkformValidation(step: any) {
    if (!step.valid) {
      step.markAllAsTouched();
    }
  }

  enable(event: any, field: string) {
    const formField = this.step2.get(field);
    if (event.checked === true) {
      formField?.setValidators([Validators.required]);
      formField?.markAllAsTouched();
    } else {
      formField?.clearValidators();

    }
    formField?.updateValueAndValidity();
  }

  addProduct(value?: string, field?: string) {
    const data = this.step2.value;
    if (data.productType === 'physical') {
      this.products.push({
        "productType": data?.productType,
        "products": data?.productIds
      });
    } else if (data.productType === 'digital') {
      if (value) {
        const index = this.subProducts.findIndex(obj => obj['title'] == field)
        if (index > -1) {
          this.subProducts[index].amount = value;
          this.subProducts[index].isEnabled = this.switchValue(field);
        } else {
          this.subProducts.push({
            'title': field,
            'amount': value,
            'isEnabled': this.switchValue(field)
          });
        }
      }
    }

  }


  switchValue(field: string | undefined, value = true) {
    if (field) {
      const camelCase = field
        .toLowerCase()
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
          index === 0 ? word.toLowerCase() : word.toUpperCase()
        )
        .replace(/\s+/g, '');
      if (value) {
        return this.step2.get(camelCase + 'Switch')?.value;
      }
      else {
        return camelCase + 'Switch';
      }


    }

  }

  submit() {
    if (this.step1.valid && this.step2.valid && this.step3.valid && this.step4.valid) {
      const data = Object.assign({}, this.step1.value, this.step2.value, this.step3.value, this.step4.value);
      data.startDate = changeDateToApiFormat(data.startDate);
      data.endDate = changeDateToApiFormat(data.endDate);
      data.dripStartDate = changeDateToApiFormat(data.dripStartDate);
      if (this.subProducts.length > 0) {
        this.products.push({
          "productType": 'digital',
          "products": this.subProducts
        });
      }
      if (data.productIds.length > 0) {
        this.products.push({
          "productType": 'physical',
          "products": data.productIds
        });
      }
      data.products = this.products;
      if (this.id != '' && this.id != undefined) {
        const sub = this.campaignService.createOrUpdateCampaign(data, this.id).subscribe({
          next: (res) => {
            this.router.navigate(['/campaigns']);
            sub.unsubscribe();
          },
          error: (res) => {
            sub.unsubscribe();
          },
        });
      }
      else {
        
        const sub = this.campaignService.createOrUpdateCampaign(data).subscribe({
          next: (res) => {
            this.router.navigate(['/campaigns']);
            sub.unsubscribe();
          },
          error: (res) => {
            sub.unsubscribe();
          },
        });
      }
    }
    else {
      this.form.markAllAsTouched();
    }
  }


  ngOnDestroy(): void {
    this.userSub.unsubscribe();
    this.routSub?.unsubscribe();
  }
}
