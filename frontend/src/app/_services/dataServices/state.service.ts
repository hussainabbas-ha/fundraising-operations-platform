import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { State } from '../../core/modals';
import { Pagination } from '../../core/modals/pagination';



@Injectable({
  providedIn: 'root',
})
export class StateService {
  constructor(private http: HttpClient) { }

  getAllStates(params: any) {
    return this.http.get<{ success: boolean, pagination: Pagination, data: State[] }>(environment.api + 'states', { params: params }).pipe(map((res) => {
      return res;
    })
    );
  }
  getSingleState(id: string) {
    return this.http.get<{ success: boolean, data: State }>(environment.api + 'states/' + id).pipe(map((res) => {
      return res;
    })
    );
  }

  createOrUpdateRegion(data: State, id?: string) {
    if (id != '' && id != undefined) {
      return this.http.put(environment.api + 'states/' + id, data).pipe(map((res) => {
        return res;
      })
      );
    } else {
      return this.http.post(environment.api + 'states', data).pipe(map((res) => {
        return res;
      })
      );
    }

  }
  deleteState(id: string) {
    return this.http.delete(environment.api + 'states/' + id).pipe(map((res) => {
      return res;
    })
    );
  }


}
