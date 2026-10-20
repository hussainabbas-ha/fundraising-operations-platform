import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Company, Organization } from '../../core/modals';
import { Pagination } from '../../core/modals/pagination';



@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  constructor(private http: HttpClient) { }



  getAllCompanies(params: any) {
    return this.http.get<{ success: boolean, pagination: Pagination, data: Company[] }>(environment.api + 'companies', { params: params }).pipe(map((res) => {
      return res;
    })
    );
  }
  getSingleCompany(id: string) {
    return this.http.get<{ success: boolean, data: Company }>(environment.api + 'companies/' + id).pipe(map((res) => {
      return res;
    })
    );
  }
  createOrUpdateCompany(images: any[], data: Company, id?: string | '') {
    const uploadData = new FormData();
    if (images.length > 0) {
      images.forEach(el => {
        uploadData.append('companyLogo', el, el.name);
      });
    }
    uploadData.append("name", data['name']);
    uploadData.append("email", data['email']);
    uploadData.append("licence", data['licence']);
    uploadData.append("status", data['status']);
    uploadData.append("phoneNo", data['phoneNo'] ? data['phoneNo'] : '');
    uploadData.append("website", data['website']);
    uploadData.append("subdomain", data['subdomain']);
    uploadData.append("address", data['address']);
    uploadData.append("package", data['package'] ? JSON.stringify(data['package']) : '');
    if (id != undefined && id != '') {
      return this.http.put(environment.api + 'companies/' + id, uploadData).pipe(map((res) => {
        return res;
      })
      );
    } else {
      return this.http.post(environment.api + 'companies', uploadData).pipe(map((res) => {
        return res;
      })
      );
    }

  }
    getCompanyDetail(id: string) {
      return this.http.get<{ success: boolean, pagination: Pagination, data: {company: Company, organizations: Organization[]} }>(environment.api + 'companies/company/detail/' + id).pipe(map((res) => {
        return res;
      })
      );
    }

  createTemplate(id: string) {
    return this.http.get<{ success: boolean }>(environment.api + 'companies/create-templates/' + id).pipe(map((res) => {
      return res;
    })
    );
  }

  deleteCompany(id: string) {
    return this.http.delete(environment.api + 'companies/' + id).pipe(map((res) => {
      return res;
    })
    );
  }
}
