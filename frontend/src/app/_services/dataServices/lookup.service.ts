import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { lookupData, User } from '../../core/modals';
import { Pagination } from '../../core/modals/pagination';
import { Params } from '@angular/router';



@Injectable({
  providedIn: 'root',
})
export class LookupService {
  constructor(private http: HttpClient) { }

  getRolesLookup() {
    return this.http.get<{ success: boolean, data: lookupData[] }>(environment.api + 'lookup/getRoles').pipe(map((res) => {
      return res;
    })
    );
  }

  getUserStatusLookup() {
    return this.http.get<{ success: boolean, data: lookupData[] }>(environment.api + 'lookup/getUserStatus').pipe(map((res) => {
      return res;
    })
    );
  }

  getStatesLookup() {
    return this.http.get<{ success: boolean, data: lookupData[] }>(environment.api + 'lookup/getStates').pipe(map((res) => {
      return res;
    })
    );
  }

  getCompanyLookup() {
    return this.http.get<{ success: boolean, data: lookupData[] }>(environment.api + 'lookup/getCompanies').pipe(map((res) => {
      return res;
    })
    );
  }

  getOrganizationLookup(params: Params) {
    return this.http.get<{ success: boolean, data: lookupData[] }>(environment.api + 'lookup/getOrganizations', { params: params }).pipe(map((res) => {
      return res;
    })
    );
  }

  getAppSettingLookup(params: Params) {
    return this.http.get<{ success: boolean, data: lookupData[] }>(environment.api + 'lookup/getStatus', { params: params }).pipe(map((res) => {
      return res;
    })
    );
  }
  getDripCampaignTypeLookup() {
    return this.http.get<{ success: boolean, data: lookupData[] }>(environment.api + 'lookup/getStatus?code=drip_campaign_type').pipe(map((res) => {
      return res;
    })
    );
  }
  getVendorsLookup() {
    return this.http.get<{ success: boolean, data: lookupData[] }>(environment.api + 'lookup/getVendors').pipe(map((res) => {
      return res;
    })
    );
  }

  getGroupLookup(params : Params) {
    return this.http.get<{ success: boolean, data: lookupData[] }>(environment.api + 'lookup/getGroups',{params : params}).pipe(map((res) => {
      return res;
    })
    );
  }

  getLeaderLookup(params: Params) {
    return this.http.get<{ success: boolean, data: lookupData[] }>(environment.api + 'lookup/getOrganizationUsers', { params: params }).pipe(map((res) => {
      return res;
    })
    );
  }

  getCampaiognSeasonsLookup() {
    return this.http.get<{ success: boolean, data: lookupData[] }>(environment.api + 'lookup/getStatus?code=seasons').pipe(map((res) => {
      return res;
    })
    );
  }

  getProductTypeLookup() {
    return this.http.get<{ success: boolean, data: lookupData[] }>(environment.api + 'lookup/getStatus?code=campaign_product_type').pipe(map((res) => {
      return res;
    })
    );
  }

  getProductLookup(params : Params) {
    return this.http.get<{ success: boolean, data: lookupData[] }>(environment.api + 'lookup/getProductsByVendor',{params : params}).pipe(map((res) => {
      return res;
    })
    );
  }

  getContactTypeLookup() {
    return this.http.get<{ success: boolean, data: lookupData[] }>(environment.api + 'lookup/getStatus?code=contact_type').pipe(map((res) => {
      return res;
    })
    );
  }

  getEmailTypeLookup() {
    return this.http.get<{ success: boolean, data: lookupData[] }>(environment.api + 'lookup/getStatus?code=email_type').pipe(map((res) => {
      return res;
    })
    );
  }

  getPhoneTypeLookup() {
    return this.http.get<{ success: boolean, data: lookupData[] }>(environment.api + 'lookup/getStatus?code=phone_type').pipe(map((res) => {
      return res;
    })
    );
  }

  getContactsLookup() {
    return this.http.get<{ success: boolean, data: lookupData[] }>(environment.api + 'lookup/getcontacts',{}).pipe(map((res) => {
      return res;
    })
    );
  }
}