import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from '../../../_services/dataServices/user.service';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../../core/modals';
import { ImportModule } from '../../../core/import/import.module';

@Component({
  selector: 'app-user-view',
  standalone: true,
  imports: [ImportModule],
  templateUrl: './user-view.component.html',
  styleUrl: './user-view.component.scss'
})
export class UserViewComponent implements OnInit, OnDestroy {
  routSub: Subscription;
  id: string = '';
  data: User | undefined;
  imagePreview: string | undefined = '';
  dataSource:any;
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
  ) {
    this.routSub = this.route.params.subscribe(params => {
      this.id = params['id'];
    });
    if (this.id && this.id != '') {
      this.getSingleUser(this.id);
    }


  }
  ngOnInit(): void {

  }
  getSingleUser(id: string) {
    const sub = this.userService.getSingleUser(id).subscribe({
      next: (res) => {
        this.data = res.data;
        this.imagePreview=res.data?.image;
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  getAllUsers() {
    const sub = this.userService.getAllUsers(null).subscribe({
      next: (res) => {
        this.dataSource = res.data;
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  ngOnDestroy(): void {
    this.routSub.unsubscribe();
  }
}
