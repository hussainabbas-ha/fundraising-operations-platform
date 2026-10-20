import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Vendor } from '../../core/modals';
import { Pagination } from '../../core/modals/pagination';



@Injectable({
  providedIn: 'root',
})
export class VendorService {
  constructor(private http: HttpClient) { }



  getAllVendors(params: any) {
    return this.http.get<{ success: boolean, pagination: Pagination, data: Vendor[] }>(environment.api + 'vendors/', { params: params }).pipe(map((res) => {
      return res;
    })
    );
  }
  getSingleVendor(id: string) {
    return this.http.get<{ success: boolean, data: Vendor }>(environment.api + 'vendors/' + id).pipe(map((res) => {
      return res;
    })
    );
  }
  createOrUpdateVendor( data: Vendor, id?: string | '') {
    if (id != '' && id != undefined) {
      return this.http.put(environment.api + 'vendors/' + id, data).pipe(map((res) => {
        return res;
      })
      );
    } else {
      return this.http.post(environment.api + 'vendors', data).pipe(map((res) => {
        return res;
      })
      );
    }

  }
  deleteVendor(id: string) {
    return this.http.delete(environment.api + 'vendors/' + id).pipe(map((res) => {
      return res;
    })
    );
  }
}
