import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Group, Organization } from '../../core/modals';
import { Pagination } from '../../core/modals/pagination';



@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  constructor(private http: HttpClient) { }



  getAllOrganizations(params: any) {
    return this.http.get<{ success: boolean, pagination: Pagination, data: Organization[] }>(environment.api + 'organizations', { params: params }).pipe(map((res) => {
      return res;
    })
    );
  }
  getSingleOrganization(id: string) {
    return this.http.get<{ success: boolean, data: Organization }>(environment.api + 'organizations/' + id).pipe(map((res) => {
      return res;
    })
    );
  }
  getOrganizationDetail(id: string) {
    return this.http.get<{ success: boolean, pagination: Pagination, data: {organization: Organization, groups:Group[]} }>(environment.api + 'organizations/detail/' + id).pipe(map((res) => {
      return res;
    })
    );
  }
  createOrUpdateOrganization(images: any[], data: Organization, id?: string|'') {
    const uploadData = new FormData();
    if (images.length > 0) {
      images.forEach(el => {
        uploadData.append('organizationLogo', el, el.name);
      });
    }
    uploadData.append("name", data["name"]);
    uploadData.append("address", data['address']);
    uploadData.append("email", data['email']);
    uploadData.append("phoneNo", data['phoneNo'] ? data['phoneNo'] : '');
    if(id!=undefined && id!=''){
      return this.http.put(environment.api + 'organizations/' + id, uploadData).pipe(map((res) => {
        return res;
      })
      );
    }else{
      return this.http.post(environment.api + 'organizations', uploadData).pipe(map((res) => {
        return res;
      })
      );
    }
    
  }

  deleteOrganization(id: string) {
    return this.http.delete(environment.api + 'organizations/' + id).pipe(map((res) => {
      return res;
    })
    );
  }
}
