import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RolesService } from '../../../../_services/dataServices/roles.service';
import { ImportModule } from '../../../../core/import/import.module';
import { VMessageComponent } from '../../../../core/v-message/v-message.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SettingsService } from '../../../../_services/dataServices/settings.service';

@Component({
  selector: 'app-new-role',
  standalone: true,
  imports: [ImportModule, VMessageComponent],
  templateUrl: './new-role.component.html',
  styleUrl: './new-role.component.scss'
})
export class NewRoleComponent implements OnInit, OnDestroy {
  id: string = '';
  form: FormGroup;
  routSub: Subscription;
  permissions: { [key: string]: { [key: string]: boolean } } = {};
  dataSource = {};
  constructor(
    private route: ActivatedRoute,
    private rolesService: RolesService,
    private formBuilder: FormBuilder,
    private appSettingsService: SettingsService,
    private router: Router,
  ) {
    this.routSub = this.route.params.subscribe(params => {
      this.id = params['id'];
    });

    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      priority: [0, [Validators.required]],
      permissions: [{}, [Validators.required]]
    });
    this.getAllPermissions();
    if (this.id != '' && this.id != undefined) {
      this.getSingleRole(this.id);
    }

  }
  ngOnInit(): void {
  }
  getSingleRole(id: string) {
    const sub = this.rolesService.getSingleRole(id).subscribe({
      next: (res) => {
        let data = res['data'];
        this.permissions = res['data'].permissions;
        this.form.patchValue({
          name: data?.name ? data?.name : '',
          priority: data?.priority ? data?.priority : 0,
          permissions: data.permissions ? data.permissions : {}
        })
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }
  getAllPermissions() {
    const sub = this.appSettingsService.getAllPermissions({ code: 'perm' }).subscribe({
      next: (res) => {
        this.dataSource = res.data.value;
        sub.unsubscribe();
      },
      error: (res) => {
        sub.unsubscribe();
      },
    });
  }

  submit() {
    if (this.form.valid) {
      const data = this.form.value;
      if (this.id != '' && this.id != undefined) {
        const sub = this.rolesService.createOrUpdateRole(data, this.id).subscribe({
          next: (res) => {
            sub.unsubscribe();
          },
          error: (res) => {
            sub.unsubscribe();
          },
        });
      }
      else {
        const sub = this.rolesService.createOrUpdateRole(data).subscribe({
          next: (res) => {
            sub.unsubscribe();
          },
          error: (res) => {
            sub.unsubscribe();
          },
        });
      }
      this.router.navigate(['/masterdata/roles']);
    }
    else {
      this.form.markAllAsTouched();
    }
  }
  setPermission(component: string, permission: string, status: { checked: boolean }) {
    if (this.permissions[component] == undefined) {
      this.permissions[component] = {};
    }
    this.permissions[component][permission] = status.checked;
    this.form.patchValue({ permissions: this.permissions });
  }
  getKeys(ob: object): string[] {
    return Object.keys(ob);
  }
  ngOnDestroy(): void {
    this.routSub.unsubscribe();
  }
}
