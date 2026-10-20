import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Contact, ContactGroup } from '../../core/modals';
import { Pagination } from '../../core/modals/pagination';



@Injectable({
  providedIn: 'root',
})
export class ContactGroupService {
  constructor(private http: HttpClient) { }



  getAllContactsGroup(params: any) {
    return this.http.get<{ success: boolean, pagination: Pagination, data: ContactGroup[] }>(environment.api + 'contactGroups', { params: params }).pipe(map((res) => {
      return res;
    })
    );
  }
  getSingleContactGroup(id: string) {
    return this.http.get<{ success: boolean, data: ContactGroup }>(environment.api + 'contactGroups/' + id).pipe(map((res) => {
      return res;
    })
    );
  }

  createOrUpdateContactGroup(data: ContactGroup, id?: string) {
    if (id != '' && id != undefined) {
      return this.http.put(environment.api + 'contactGroups/' + id, data).pipe(map((res) => {
        return res;
      })
      );
    } else {
      return this.http.post(environment.api + 'contactGroups', data).pipe(map((res) => {
        return res;
      })
      );
    }

  }

  deleteContactGroup(id: string) {
    return this.http.delete(environment.api + 'contacts/' + id).pipe(map((res) => {
      return res;
    })
    );
  }


}
