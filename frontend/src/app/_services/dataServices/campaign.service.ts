import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Campaign, CampaignMembers, CampaignProduct, Product } from '../../core/modals';
import { Pagination } from '../../core/modals/pagination';



@Injectable({
  providedIn: 'root',
})
export class CampaignService {
  constructor(private http: HttpClient) { }



  getAllCampaigns(params: any) {
    return this.http.get<{ success: boolean, pagination: Pagination, data: Campaign[] }>(environment.api + 'campaigns', { params: params }).pipe(map((res) => {
      return res;
    })
    );
  }
  getSingleCampaign(id: string) {
    return this.http.get<{ success: boolean, data: Campaign }>(environment.api + 'campaigns/' + id).pipe(map((res) => {
      return res;
    })
    );
  }

  createOrUpdateCampaign(data: Campaign, id?: string) {
    if (id != '' && id != undefined) {
      return this.http.put(environment.api + 'campaigns/' + id, data).pipe(map((res) => {
        return res;
      })
      );
    } else {
      return this.http.post(environment.api + 'campaigns', data).pipe(map((res) => {
        return res;
      })
      );
    }

  }

  deleteCampaign(id: string) {
    return this.http.delete(environment.api + 'campaigns/' + id).pipe(map((res) => {
      return res;
    })
    );
  }

  inviteLeader(data: Object) {
    return this.http.post(environment.api + 'campaigns/inviteCoach', data).pipe(map((res) => {
      return res;
    })
    );
  }
  getCampaignDetail(id: string) {
      return this.http.get<{ success: boolean, pagination: Pagination, data: {campaign: Campaign , members:CampaignMembers[]} }>(environment.api + 'campaigns/detail/' + id).pipe(map((res) => {
        return res;
      })
      );
    }

}
