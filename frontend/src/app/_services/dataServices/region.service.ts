import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Region } from '../../core/modals';
import { Pagination } from '../../core/modals/pagination';



@Injectable({
  providedIn: 'root',
})
export class RegionService {
  constructor(private http: HttpClient) { }

  getAllRegions(params: any) {
    return this.http.get<{ success: boolean, pagination: Pagination, data: Region[] }>(environment.api + 'regions', { params: params }).pipe(map((res) => {
      return res;
    })
    );
  }
  getSingleRegion(id: string) {
    return this.http.get<{ success: boolean, data: Region }>(environment.api + 'regions/' + id).pipe(map((res) => {
      return res;
    })
    );
  }

  createOrUpdateRegion(data: Region, id?: string) {
      if (id != '' && id != undefined) {
        return this.http.put(environment.api + 'regions/' + id, data).pipe(map((res) => {
          return res;
        })
        );
      } else {
        return this.http.post(environment.api + 'regions', data).pipe(map((res) => {
          return res;
        })
        );
      }
  
    }
 

  deleteRegion(id: string) {
    return this.http.delete(environment.api + 'regions/' + id).pipe(map((res) => {
      return res;
    })
    );
  }


}
