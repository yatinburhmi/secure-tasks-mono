import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { RoleType } from '@secure-tasks-mono/data';
import { AuthService } from '../../services/auth.service';
import { RootState } from '../../store';
import { selectCurrentRole } from '../../store/auth/auth.selectors';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-role-switcher',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './role-switcher.component.html',
  styleUrls: ['./role-switcher.component.css'],
})
export class RoleSwitcherComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly store = inject(Store<RootState>);

  public availableRoles: RoleType[] = [
    RoleType.OWNER,
    RoleType.ADMIN,
    RoleType.VIEWER,
  ];
  public selectedRole: RoleType = RoleType.VIEWER;

  ngOnInit(): void {
    this.store
      .select(selectCurrentRole)
      .pipe(take(1))
      .subscribe((role) => {
        if (role) {
          this.selectedRole = role;
        }
      });
  }

  /**
   * Handles role change event from the select element
   * Dispatches the switchRole action via AuthService
   */
  public handleRoleChange(newRole: RoleType): void {
    this.authService.switchRole(newRole);
  }
}
