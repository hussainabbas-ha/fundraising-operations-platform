import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Company, EmailType } from '../../core/modals';
import { Pagination } from '../../core/modals/pagination';



@Injectable({
  providedIn: 'root',
})
export class EmailTypeService {
  constructor(private http: HttpClient) { }
  getAllTypes(params: any) {
    return this.http.get<{ success: boolean, pagination: Pagination, data: EmailType[] }>(environment.api + 'emailTypes', { params: params }).pipe(map((res) => {
      return res;
    })
    );
  }
  getSingleEmailType(id: string) {
    return this.http.get<{ success: boolean, data: EmailType }>(environment.api + 'emailTypes/' + id).pipe(map((res) => {
      return res;
    })
    );
  }
  createOrUpdateEmailType(data: EmailType, id?: string | '') {
    if (id != undefined && id != '') {
      return this.http.put(environment.api + 'emailTypes/' + id, data).pipe(map((res) => {
        return res;
      })
      );
    } else {
      return this.http.post(environment.api + 'emailTypes', data).pipe(map((res) => {
        return res;
      })
      );
    }

  }
}
