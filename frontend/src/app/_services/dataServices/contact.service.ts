import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Contact } from '../../core/modals';
import { Pagination } from '../../core/modals/pagination';



@Injectable({
  providedIn: 'root',
})
export class ContactService {
  constructor(private http: HttpClient) { }



  getAllContacts(params: any) {
    return this.http.get<{ success: boolean, pagination: Pagination, data: Contact[] }>(environment.api + 'contacts', { params: params }).pipe(map((res) => {
      return res;
    })
    );
  }
  getSingleContact(id: string) {
    return this.http.get<{ success: boolean, data: Contact }>(environment.api + 'contacts/' + id).pipe(map((res) => {
      return res;
    })
    );
  }

  createOrUpdateContact(data: Contact, id?: string) {
    if (id != '' && id != undefined) {
      return this.http.put(environment.api + 'contacts/' + id, data).pipe(map((res) => {
        return res;
      })
      );
    } else {
      return this.http.post(environment.api + 'contacts', data).pipe(map((res) => {
        return res;
      })
      );
    }

  }

  deleteContact(id: string) {
    return this.http.delete(environment.api + 'contacts/' + id).pipe(map((res) => {
      return res;
    })
    );
  }


}
