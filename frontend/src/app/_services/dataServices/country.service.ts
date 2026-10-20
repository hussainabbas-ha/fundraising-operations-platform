import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Country } from '../../core/modals';
import { Pagination } from '../../core/modals/pagination';



@Injectable({
  providedIn: 'root',
})
export class CountryService {
  constructor(private http: HttpClient) { }



  getAllCountries(params: any) {
    return this.http.get<{ success: boolean, pagination: Pagination, data: Country[] }>(environment.api + 'countries', { params: params }).pipe(map((res) => {
      return res;
    })
    );
  }
  getSingleCountry(id: string) {
    return this.http.get<{ success: boolean, data: Country }>(environment.api + 'countries/' + id).pipe(map((res) => {
      return res;
    })
    );
  }

  createOrUpdateCountry(data: Country, id?: string) {
    if (id != '' && id != undefined) {
      return this.http.put(environment.api + 'countries/' + id, data).pipe(map((res) => {
        return res;
      })
      );
    } else {
      return this.http.post(environment.api + 'countries', data).pipe(map((res) => {
        return res;
      })
      );
    }

  }

  deleteCountry(id: string) {
    return this.http.delete(environment.api + 'countries/' + id).pipe(map((res) => {
      return res;
    })
    );
  }


}
