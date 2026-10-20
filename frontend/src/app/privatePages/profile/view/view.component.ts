import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../_services/dataServices/user.service';
import { User } from '../../../core/modals';
import { UpdateComponent } from '../update/update.component';
import { MatDialog } from '@angular/material/dialog';
import { ImportModule } from '../../../core/import/import.module';

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [ImportModule],
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss'
})
export class ViewComponent implements OnInit {
  id: string = '';
  data: User | undefined;
  imagePreview: string | undefined = '';
  constructor(
    private userService: UserService,
      private dialog: MatDialog,
  ) {
    this.getProfile();
  }

  ngOnInit(): void {
  }

  getProfile() {
    const sub = this.userService.getProfile().subscribe({
      next: (res) => {
        this.data = res?.data;
        this.imagePreview = res.data?.image;
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  updateProfile() {
      const isMobile = window.innerWidth < 768;
      const DialogRef = this.dialog.open(UpdateComponent, {
        data: { data:this.data },
        width: '80%',
        height: isMobile ? '70%' : '',
        disableClose: true,
      });
      const sub = DialogRef.afterClosed().subscribe((res) => {
        this.getProfile();
        sub.unsubscribe();
      });
    }
}
