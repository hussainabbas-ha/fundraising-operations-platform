import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Company, EmailTemplate, EmailType, Fields } from '../../core/modals';
import { Pagination } from '../../core/modals/pagination';
import { Params } from '@angular/router';



@Injectable({
  providedIn: 'root',
})
export class EmailTemplateService {
  constructor(private http: HttpClient) { }

  getEmailTypes(params: Params) {
    return this.http.get<{ success: boolean, pagination: Pagination, data: EmailTemplate[] }>(environment.api + 'emailTemplates/list/types', { params: params }).pipe(map((res) => {
      return res;
    })
    );
  }

  getEmailTemplatesById(id: string) {
    return this.http.get<{ success: boolean, pagination: Pagination, data: EmailTemplate[] }>(environment.api + 'emailTemplates/list/templates/' + id).pipe(map((res) => {
      return res;
    })
    );
  }

  getSingleEmailTemplate(id: string) {
    return this.http.get<{ success: boolean, data: EmailTemplate }>(environment.api + 'emailTemplates/' + id).pipe(map((res) => {
      return res;
    })
    );
  }

  getFieldsByType(id: string) {
    return this.http.get<{ success: boolean, data: EmailType }>(environment.api + 'emailTemplates/email/type-fields/' + id).pipe(map((res) => {
      return res;
    })
    );
  }
  createOrUpdateEmailTemplate(data: EmailTemplate, id?: string | '') {
    if (id != undefined && id != '') {
      return this.http.put(environment.api + 'emailTemplates/' + id, data).pipe(map((res) => {
        return res;
      })
      );
    } else {
      return this.http.post(environment.api + 'emailTemplates', data).pipe(map((res) => {
        return res;
      })
      );
    }

  }
  updateStatus(id: string, emailTypeId: string) {
    return this.http.put(environment.api + 'emailTemplates/updateStatus/' + id, { emailTypeId: emailTypeId }).pipe(map((res) => {
      return res;
    })
    )
  }

  duplicateTemplate(id:string) {
    return this.http.post(environment.api + 'emailTemplates/duplicate/' + id, {}).pipe(map((res) => {
      return res;
    })
    );
  }


  deleteTemplate(id: string) {
    return this.http.delete(environment.api + 'emailTemplates/' + id).pipe(map((res) => {
      return res;
    })
    );
  }
}
