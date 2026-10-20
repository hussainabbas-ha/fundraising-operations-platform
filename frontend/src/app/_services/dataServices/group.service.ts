import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Group } from '../../core/modals';
import { Pagination } from '../../core/modals/pagination';



@Injectable({
  providedIn: 'root',
})
export class GroupService {
  constructor(private http: HttpClient) { }



  getAllGroups(params: any) {
    return this.http.get<{ success: boolean, pagination: Pagination, data: Group[] }>(environment.api + 'groups', { params: params }).pipe(map((res) => {
      return res;
    })
    );
  }
  getSingleGroup(id: string) {
    return this.http.get<{ success: boolean, data: Group }>(environment.api + 'groups/' + id).pipe(map((res) => {
      return res;
    })
    );
  }
  getGroupDetail(id: string) {
    return this.http.get<{ success: boolean, pagination: Pagination, data: Group }>(environment.api + 'groups/' + id).pipe(map((res) => {
      return res;
    })
    );
  }
  createOrUpdateGroup(images: any[], data: Group, id?: string | '') {
    const uploadData = new FormData();
    if (images.length > 0) {
      images.forEach(el => {
        if (el.type == 'logo') {
          uploadData.append('groupLogo', el.image, el.image.name);
        }
        if (el.type == 'coverImage') {
          uploadData.append('groupCoverImage', el.image, el.image.name);
        }

      });
    }
    uploadData.append("name", data["name"]);
    uploadData.append("organizationId", data['organizationId']);
    if (id != undefined && id != '') {
      return this.http.put(environment.api + 'groups/' + id, uploadData).pipe(map((res) => {
        return res;
      })
      );
    } else {
      return this.http.post(environment.api + 'groups', uploadData).pipe(map((res) => {
        return res;
      })
      );
    }

  }
  deleteGroup(id: string) {
    return this.http.delete(environment.api + 'groups/' + id).pipe(map((res) => {
      return res;
    })
    );
  }
}
