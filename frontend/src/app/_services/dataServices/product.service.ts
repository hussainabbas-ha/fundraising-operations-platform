import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product } from '../../core/modals';
import { Pagination } from '../../core/modals/pagination';



@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) { }



  getAllProducts(params: any) {
    return this.http.get<{ success: boolean, pagination: Pagination, data: Product[] }>(environment.api + 'products', { params: params }).pipe(map((res) => {
      return res;
    })
    );
  }
  getSingleProduct(id: string) {
    return this.http.get<{ success: boolean, data: Product }>(environment.api + 'products/' + id).pipe(map((res) => {
      return res;
    })
    );
  }

  createOrUpdateProduct(images: any[], data: Product, id?: string) {
    const uploadData = new FormData();
    if (images.length > 0) {
      images.forEach(el => {
        uploadData.append('productImage', el, el.name);
      });
    }
    uploadData.append("title", data['title']);
    uploadData.append("costPrice", data['costPrice'] ? data['costPrice'].toString() : '');
    uploadData.append("sellingPrice", data['sellingPrice'] ? data['sellingPrice'].toString() : '');
    uploadData.append("vendorId", data['vendorId']);
    uploadData.append("isActive", data['isActive'] ? data['isActive'].toString() : '');
    uploadData.append("variants", data['variants'] ? JSON.stringify(data['variants']) : '');

    if (id != '' && id != undefined) {
      return this.http.put(environment.api + 'products/' + id, uploadData).pipe(map((res) => {
        return res;
      })
      );
    } else {
      return this.http.post(environment.api + 'products', uploadData).pipe(map((res) => {
        return res;
      })
      );
    }

  }

  deleteProduct(id: string) {
    return this.http.delete(environment.api + 'products/' + id).pipe(map((res) => {
      return res;
    })
    );
  }


}
