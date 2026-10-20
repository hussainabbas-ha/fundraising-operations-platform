import { Routes } from '@angular/router';
import { LoginComponent } from './publicPages/auth/login/login.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { DashboardComponent } from './privatePages/dashboard/dashboard.component';
import { AuthGuard } from './core/guards/auth.guard';
import { LoggedOffGuard } from './core/guards/logged-off.guard';
import { SignUpComponent } from './publicPages/auth/sign-up/sign-up.component';
import { CountryComponent } from './privatePages/masterdata/country/country.component';
import { StatesComponent } from './privatePages/masterdata/states/states.component';
import { RegionComponent } from './privatePages/masterdata/region/region.component';
import { UsersComponent } from './privatePages/users/users.component';
import { CompanyComponent } from './privatePages/company/company.component';
import { AppSettingsComponent } from './privatePages/masterdata/app-settings/app-settings.component';
import { RolesComponent } from './privatePages/masterdata/roles/roles.component';
import { NewRoleComponent } from './privatePages/masterdata/roles/new-role/new-role.component';
import { OrganizationComponent } from './privatePages/organization/organization.component';
import { GroupComponent } from './privatePages/group/group.component';
import { UserViewComponent } from './privatePages/users/user-view/user-view.component';
import { OrgViewComponent } from './privatePages/organization/org-view/org-view.component';
import { EmailTypesComponent } from './privatePages/masterdata/email-types/email-types.component';
import { GroupViewComponent } from './privatePages/group/group-view/group-view.component';
import { EmailTemplatesComponent } from './privatePages/email-templates/email-templates.component';
import { NewTemplateComponent } from './privatePages/email-templates/new-template/new-template.component';
import { DripCampaignComponent } from './privatePages/drip-campaign/drip-campaign.component';
import { VendorComponent } from './privatePages/vendor/vendor.component';
import { ProductComponent } from './privatePages/product/product.component';
import { ViewComponent } from './privatePages/profile/view/view.component';
import { UpdateComponent } from './privatePages/profile/update/update.component';
import { FundRaiserComponent } from './publicPages/fund-raiser/fund-raiser.component';
import { CampaginComponent } from './privatePages/campagin/campagin.component';
import { CompanyViewComponent } from './privatePages/company/company-view/company-view.component';
import { NewCampaignComponent } from './privatePages/campagin/new-campaign/new-campaign.component';
import { ContactsComponent } from './privatePages/contacts/contacts.component';
import { ContactGroupComponent } from './privatePages/contact-group/contact-group.component';
import { CampaignViewComponent } from './privatePages/campagin/campaign-view/campaign-view.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [LoggedOffGuard]
    },
    {
        path: 'signup',
        component: SignUpComponent,
        canActivate: [LoggedOffGuard]
    },
    {
        path: 'campaign-progress/:campaignId/fund-raising/:studentId',
        component: FundRaiserComponent,
        canActivate: [LoggedOffGuard]
    },
    {
        path: '',
        component: AuthLayoutComponent,
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent,
                canActivate: [AuthGuard],
                data: { component: 'dashboard', permission: 'view' }
            },
            {
                path: 'users',
                component: UsersComponent,
                canActivate: [AuthGuard],
                data: { component: 'user', permission: 'view' }
            },
            {
                path: 'users/:id',
                component: UserViewComponent,
                canActivate: [AuthGuard],
                data: { component: 'user', permission: 'view' }
            },
            {
                path: 'profile',
                component: ViewComponent,
                canActivate: [AuthGuard],
                data: { component: 'user', permission: 'view' }
            },
            {
                path: 'profile/update',
                component: UpdateComponent,
                canActivate: [AuthGuard],
                data: { component: 'user', permission: 'update' }
            },
            {
                path: 'company',
                component: CompanyComponent,
                canActivate: [AuthGuard],
                data: { component: 'company', permission: 'view' }
            },
            {
                path: 'company/detail/:id',
                component: CompanyViewComponent,
                canActivate: [AuthGuard],
                data: { component: 'company', permission: 'view' }
            },
            {
                path: 'organizations',
                component: OrganizationComponent,
                canActivate: [AuthGuard],
                data: { component: 'organization', permission: 'view' }
            },
            {
                path: 'organizations/detail/:id',
                component: OrgViewComponent,
                canActivate: [AuthGuard],
                data: { component: 'organization', permission: 'view' }
            },
            {
                path: 'groups',
                component: GroupComponent,
                canActivate: [AuthGuard],
                data: { component: 'group', permission: 'view' }
            },
            {
                path: 'email-templates',
                component: EmailTemplatesComponent,
                canActivate: [AuthGuard],
                data: { component: 'emailTemplate', permission: 'view' }
            },
            {
                path: 'email-templates/add',
                component: NewTemplateComponent,
                canActivate: [AuthGuard],
                data: { component: 'emailTemplate', permission: 'add' }
            },
            {
                path: 'email-templates/update/:id',
                component: NewTemplateComponent,
                canActivate: [AuthGuard],
                data: { component: 'emailTemplate', permission: 'update' }
            },
            {
                path: 'groups/:id',
                component: GroupViewComponent,
                canActivate: [AuthGuard],
                data: { component: 'group', permission: 'view' }
            },
            {
                path: 'dripCampaign',
                component: DripCampaignComponent,
                canActivate: [AuthGuard],
                data: { component: 'dripCampaign', permission: 'view' }
            },
            {
                path: 'vendors',
                component: VendorComponent,
                canActivate: [AuthGuard],
                data: { component: 'vendor', permission: 'view' }
            },
            {
                path: 'products',
                component: ProductComponent,
                canActivate: [AuthGuard],
                data: { component: 'product', permission: 'view' }
            },
            {
                path: 'campaigns',
                component: CampaginComponent,
                canActivate: [AuthGuard],
                data: { component: 'campaign', permission: 'view' }
            },
            {
                path: 'campaigns/add',
                component: NewCampaignComponent,
                canActivate: [AuthGuard],
                data: { component: 'campaign', permission: 'add' }
            },
            {
                path: 'campaigns/:id',
                component: NewCampaignComponent,
                canActivate: [AuthGuard],
                data: { component: 'campaign', permission: 'update' }
            },
            {
                path: 'campaigns/detail/:id',
                component: CampaignViewComponent,
                canActivate: [AuthGuard],
                data: {component: 'campaign', permission: 'view'}
            },
            {
                path: 'contacts',
                component: ContactsComponent,
                canActivate: [AuthGuard],
                data: { component: 'contact', permission: 'view' }
            },
            {
                path: 'contact-group',
                component: ContactGroupComponent,
                canActivate: [AuthGuard],
                data: { component: 'contactGroup', permission: 'view' }
            },
            {
                path: 'masterdata/country',
                component: CountryComponent,
                canActivate: [AuthGuard],
                data: { component: 'country', permission: 'view' }
            },
            {
                path: 'masterdata/states',
                component: StatesComponent,
                canActivate: [AuthGuard],
                data: { component: 'state', permission: 'view' }
            },
            {
                path: 'masterdata/regions',
                component: RegionComponent,
                canActivate: [AuthGuard],
                data: { component: 'region', permission: 'view' }
            },
            {
                path: 'masterdata/email-types',
                component: EmailTypesComponent,
                canActivate: [AuthGuard],
                data: { component: 'emailType', permission: 'view' }
            },
            {
                path: 'masterdata/settings',
                component: AppSettingsComponent,
                canActivate: [AuthGuard],
                data: { component: 'appsetting', permission: 'view' }
            },
            {
                path: 'masterdata/roles',
                component: RolesComponent,
                canActivate: [AuthGuard],
                data: { component: 'role', permission: 'view' }
            },
            {
                path: 'masterdata/roles/add',
                component: NewRoleComponent,
                canActivate: [AuthGuard],
                data: { component: 'role', permission: 'add' }
            },
            {
                path: 'masterdata/roles/:id',
                component: NewRoleComponent,
                canActivate: [AuthGuard],
                data: { component: 'role', permission: 'update' }
            },
        ]
    }
];
