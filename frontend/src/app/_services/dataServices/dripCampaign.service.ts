import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DripCampaign } from '../../core/modals';
import { Pagination } from '../../core/modals/pagination';



@Injectable({
  providedIn: 'root',
})
export class DripCampaignService {
  constructor(private http: HttpClient) { }



  getAllDripCampaigns(params: any) {
    return this.http.get<{ success: boolean, pagination: Pagination, data: DripCampaign[] }>(environment.api + 'dripCampaign/', { params: params }).pipe(map((res) => {
      return res;
    })
    );
  }
  getSingleDripCampaign(id: string) {
    return this.http.get<{ success: boolean, data: DripCampaign }>(environment.api + 'dripCampaign/' + id).pipe(map((res) => {
      return res;
    })
    );
  }
  createOrUpdateDripCampaign( data: DripCampaign, id?: string | '') {
    if (id != '' && id != undefined) {
      return this.http.put(environment.api + 'dripCampaign/' + id, data).pipe(map((res) => {
        return res;
      })
      );
    } else {
      return this.http.post(environment.api + 'dripCampaign', data).pipe(map((res) => {
        return res;
      })
      );
    }

  }
  deleteDripCampaign(id: string) {
    return this.http.delete(environment.api + 'dripCampaign/' + id).pipe(map((res) => {
      return res;
    })
    );
  }
}
