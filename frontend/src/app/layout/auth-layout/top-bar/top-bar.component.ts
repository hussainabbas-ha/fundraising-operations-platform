import { Component } from '@angular/core';
import { LeftMenuService } from '../../../_services/common/left-bar.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss'
})
export class TopBarComponent {
  constructor(private leftBarService:LeftMenuService){

  }
  showMenu() {
    this.leftBarService.toggleSidebar();
  }
}
