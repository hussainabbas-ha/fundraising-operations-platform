import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../../core/modals';
import { AuthService } from '../../_services/common/auth.service';
import { CommonModule } from '@angular/common';
import { LeftSideBarComponent } from './left-side-bar/left-side-bar.component';
import { TopBarComponent } from './top-bar/top-bar.component';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule,LeftSideBarComponent,TopBarComponent],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss'
})
export class AuthLayoutComponent {
  load = false;
  constructor(
    private _auth: AuthService,
  ) {
    this._auth.isLoggedIn;
  }
}
