import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../core/modals';
import { Pagination } from '../../core/modals/pagination';



@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) { }

  getAllUsers(params: any) {
    return this.http.get<{ success: boolean, pagination: Pagination, data: User[] }>(environment.api + 'users', { params: params }).pipe(map((res) => {
      return res;
    })
    );
  }

  getSingleUser(id: string) {
    return this.http.get<{ success: boolean, data: User }>(environment.api + 'users/' + id).pipe(map((res) => {
      return res;
    })
    );
  }

  getProfile() {
    return this.http.get<{ success: boolean, data: User }>(environment.api + 'users/profile/me').pipe(map((res) => {
      return res;
    })
    );
  }

  createOrUpdateUser(images: any[], data: User, id?: string | '') {
    const uploadData = new FormData();
    if (images.length > 0) {
      images.forEach(el => {
        uploadData.append('image', el, el.name);
      });
    }
    uploadData.append("firstName", data['firstName'])
    uploadData.append("lastName", data['lastName'])
    uploadData.append("roleId", data['roleId'])
    uploadData.append("email", data['email'])
    uploadData.append("address", data['address'])
    uploadData.append("status", data['status'])
    uploadData.append("zipCode", data['zipCode'] ? data['zipCode'].toString() : '')
    uploadData.append("password", data['password'] ? data['password'] : '')
    uploadData.append("confirm_password", data['confirm_password'] ? data['confirm_password'] : '')
    uploadData.append("phoneNo", data['phoneNo'] ? data['phoneNo'] : ''),
      uploadData.append("companyId", data['companyId'] ? data['companyId'] : '')


    if (id != undefined && id != '') {
      return this.http.put(environment.api + 'users/' + id, uploadData).pipe(map((res) => {
        return res;
      })
      );
    } else {
      return this.http.post(environment.api + 'users', uploadData).pipe(map((res) => {
        return res;
      })
      );
    }
  }

  updateProfile(images: any[], data: User) {
    const uploadData = new FormData();
    if (images.length > 0) {
      images.forEach(el => {
        uploadData.append('image', el, el.name);
      });
    }
    uploadData.append("firstName", data['firstName'])
    uploadData.append("lastName", data['lastName'])
    uploadData.append("email", data['email'])
    uploadData.append("address", data['address'])
    uploadData.append("zipCode", data['zipCode'] ? data['zipCode'].toString() : '')
    uploadData.append("phoneNo", data['phoneNo'] ? data['phoneNo'] : '')

    return this.http.post(environment.api + 'users/updateProfile' , uploadData).pipe(map((res) => {
      return res;
    })
    );

  }

  deleteUser(id: string) {
    return this.http.delete(environment.api + 'users/' + id).pipe(map((res) => {
      return res;
    })
    );
  }

  inviteUser(data: object) {
    return this.http.post(environment.api + 'users/invite', data).pipe(map((res) => {
      return res;
    })
    );
  }

  updatePassword(data: object) {
    return this.http.post(environment.api + 'users/updatePassword', data).pipe(map((res) => {
      return res;
    })
    );
  }



}
