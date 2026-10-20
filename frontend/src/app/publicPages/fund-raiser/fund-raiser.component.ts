import { afterRender, Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ImportModule } from '../../core/import/import.module';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VMessageComponent } from '../../core/v-message/v-message.component';
import { Subscription, interval } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DonationService } from '../../_services/common/donation.service';
import { Donation } from '../../core/modals';
import { isPlatformBrowser } from '@angular/common';

import { TimerComponent } from './timer/timer.component';

@Component({
  selector: 'app-fund-raiser',
  standalone: true,
  imports: [ImportModule, VMessageComponent, TimerComponent],
  templateUrl: './fund-raiser.component.html',
  styleUrl: './fund-raiser.component.scss'
})
export class FundRaiserComponent implements OnInit, OnDestroy {
  imagePreview: string | undefined = '';
  goalAmount = 1500;
  currentAmount = 600;
  form: FormGroup;
  routSub: Subscription | null;
  campaignId: string = '';
  studentId: string = '';
  data: Donation | undefined;
  selectedProduct: any = null;
  studentProgress: number = 0;
  teamProgress: number = 0;
  logoStyle = {};
  sub: Subscription | null = null;
  isBrowser: boolean = false;
  colors = ["#fb923c", "#90e0ef", "#90a955", "#d6ccc2", "#343a40", "#e0e1dd", "#74c69d", "#e0afa0", "#134074", "#f4845f", "#a5a5a5", "#065a82"];
  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private donationService: DonationService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      phoneNo: ['', [Validators.required, Validators.pattern(/^(?:\+1\s?)?(?:\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}$/)]],
      zipCode: ['', [Validators.pattern(/^\d{5}(-\d{4})?$/)]],
      email: ['', [Validators.required, Validators.pattern(/^(?!.*\.\.)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      cardNo: ['', [Validators.required, Validators.pattern(/^(?:\d{4}[ ]?){4}$/)]],
      cardExpiry: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
      amount: ['', [Validators.required]],
      qty: [''],
      message: [''],
      isAnonymous: [false]
    });
    this.routSub = this.route.params.subscribe(params => {
      this.campaignId = params['campaignId'];
      this.studentId = params['studentId']
      if (this.campaignId && this.studentId) {
        this.getCampaignDetails();
      }
      afterRender(() => {
        this.isBrowser = isPlatformBrowser(this.platformId);
      })
    });
  }
  ngOnInit(): void {
  }


  getCampaignDetails() {
    this.sub = this.donationService.getCampaignDetails(this.campaignId, this.studentId).subscribe({
      next: (res) => {
        console.log(res['data'],'data')
        this.data = res['data'];
        this.makeLogoWhiteWithFilter();

        this.studentProgress = this.setProgress(this.data.campaign.student.totalRaised, this.data.campaign.student.goal);
        this.teamProgress = this.setProgress(1000, this.data.campaign.group.goal);
      },
    });
  }

  setProgress(amount: number, goal: number) {
    return Math.min((amount / goal) * 100, 100);
  }

  makeLogoWhiteWithFilter() {
    this.logoStyle = {
      filter: 'brightness(0) invert(1)'
    };
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  }

  ngOnDestroy(): void {
    this.routSub?.unsubscribe();
    this.sub?.unsubscribe();
    // this.intervalID?.unsubscribe();
  }
}