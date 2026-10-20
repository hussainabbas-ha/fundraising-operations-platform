import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, map } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LeftMenuService {
  private leftBarSub = new BehaviorSubject<boolean>(false);
  Isleftbar = this.leftBarSub.asObservable();
  constructor(private http: HttpClient) { }


  public toggleSidebar() {
    this.leftBarSub.next(!this.leftBarSub.value);
  }

}