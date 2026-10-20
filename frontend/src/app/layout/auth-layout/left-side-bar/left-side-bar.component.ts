import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, Optional, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../_services/common/auth.service';
import { ImportModule } from '../../../core/import/import.module';
import { LeftMenuService } from '../../../_services/common/left-bar.service';
import { User } from '../../../core/modals';
import { Observable, Subscription } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ChangePasswordComponent } from '../../../privatePages/change-password/change-password.component';

@Component({
  selector: 'app-left-side-bar',
  standalone: true,
  imports: [ImportModule],
  templateUrl: './left-side-bar.component.html',
  styleUrl: './left-side-bar.component.scss'
})
export class LeftSideBarComponent implements OnInit, OnDestroy {
  naviIteam: any[] = [
    {
      label: 'Dashboard',
      icon: 'fa-regular fa-chart-bar',
      url: 'dashboard',
      permission: 'dashboard'
    },
    {
      label: 'Company',
      icon: 'fa-solid fa-building',
      url: 'company',
      permission: 'company'
    },
    {
      label: 'Users',
      icon: 'fa-solid fa-users',
      url: 'users',
      permission: 'user'
    },
    {
      label: 'Organization',
      icon: 'fa-solid fa-sitemap',
      url: 'organizations',
      permission: 'organization'
    },
    {
      label: 'Group',
      icon: 'fa-solid fa-users-between-lines',
      url: 'groups',
      permission: 'group'
    },
    {
      label: 'Email Templates',
      icon: 'fa-solid fa-envelope',
      url: 'email-templates',
      permission: 'emailTemplate'
    },
    {
      label: 'Campaign',
      icon: 'fa-solid fa-bars-progress',
      url: 'campaigns',
      permission: 'campaign'
    },
    {
      label: 'Contacts',
      icon: 'fa-solid fa-address-book',
      url: 'contacts',
      permission: 'contact'
    },
    {
      label: 'Contact Grpup',
      icon: 'fa-solid fa-address-book',
      url: 'contact-group',
      permission: 'contactGroup'
    },
    {
      label: 'Drip Campaign',
      icon: 'fa-solid fa-bars-progress',
      url: 'dripCampaign',
      permission: 'dripCampaign'
    },
    {
      label: 'Vendor',
      icon: 'fa-solid fa-handshake',
      url: 'vendors',
      permission: 'vendor'
    },
    {
      label: 'Product',
      icon: 'fa-solid fa-boxes-stacked',
      url: 'products',
      permission: 'product'
    },
    {
      label: 'Master Data',
      icon: 'fa-regular fa-hard-drive',
      url: 'masterdata',
      permission: 'devaccess',
      childs: [
        {
          label: 'Country',
          icon: 'fa-regular fa-flag',
          url: '/country',
          permission: 'country'
        },
        {
          label: 'States',
          icon: 'fa-solid fa-building-columns',
          url: '/states',
          permission: 'state'
        },
        {
          label: 'Regions',
          icon: 'fa-solid fa-earth-asia',
          url: '/regions',
          permission: 'region'
        },
        {
          label: 'Email Types',
          icon: 'fa-solid fa-earth-asia',
          url: '/email-types',
          permission: 'emailType'
        },
        {
          label: 'Roles',
          icon: 'fa-solid fa-users-gear',
          url: '/roles',
          permission: 'role'
        },
        {
          label: 'Settings',
          icon: 'fa-solid fa-gear',
          url: '/settings',
          permission: 'appsetting'
        },
      ]
    },

  ];
  topmenu: boolean = false;
  sideBarStatus: Observable<boolean>;
  companyName: string = '';
  userInfo: User | undefined;
  userSub: Subscription;
  activeUrl = "";
  isOpen: boolean = false;
  constructor(
    @Optional() private dialogRef: MatDialogRef<ChangePasswordComponent>,
    private dialog: MatDialog, 
    private _authService: AuthService, private _leftMenuService: LeftMenuService,
    private router: Router,
    
  ) {
    this.activeUrl = this.router.url;
    this.sideBarStatus = this._leftMenuService.Isleftbar;
    this.userSub = this._authService.userInfo.subscribe(res => {
      if (res != null) {
        this.userInfo = res;
      }
    });
  }


  ngOnInit(): void {
  }

  logout() {
    this._authService.logout();
  }
  toggleDiv() {
    this.isOpen = !this.isOpen;
  }
  closeMenu() {
    this._leftMenuService.toggleSidebar();
  }

  changePassword(id:string = '') {
    this.toggleDiv();
    const isMobile = window.innerWidth < 768;
    const DialogRef = this.dialog.open(ChangePasswordComponent, {
      data: { id: id },
      width: '80%',
      height: isMobile ? '70%' : '',
      disableClose: true,
    });
    const sub = DialogRef.afterClosed().subscribe((res) => {
  
      sub.unsubscribe();
    });
  }
  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
