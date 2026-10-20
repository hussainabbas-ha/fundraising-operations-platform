import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AppSetting } from '../../core/modals';
import { Pagination } from '../../core/modals/pagination';
import { Params } from '@angular/router';



@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor(private http: HttpClient) { }

  getAllSettings(params: any) {
    return this.http.get<{ success: boolean, pagination: Pagination, data: AppSetting[] }>(environment.api + 'appsettings', { params: params }).pipe(map((res) => {
      return res;
    })
    );
  }
  getSingleSetting(id: string) {
    return this.http.get<{ success: boolean, data: AppSetting }>(environment.api + 'appsettings/' + id).pipe(map((res) => {
      return res;
    })
    );
  }

  createOrUpdateSetting(data: AppSetting, id?: string) {
    if (id != '' && id != undefined) {
      return this.http.put(environment.api + 'appsettings/' + id, data).pipe(map((res) => {
        return res;
      })
      );
    } else {
      return this.http.post(environment.api + 'appsettings', data).pipe(map((res) => {
        return res;
      })
      );
    }

  }

  getAllPermissions(params: Params) {
    return this.http.get<{ success: boolean, pagination: Pagination, data: AppSetting }>(environment.api + 'appsettings/all-permissions/fetch', { params: params }).pipe(map((res) => {
      return res;
    })
    );
  }

}
