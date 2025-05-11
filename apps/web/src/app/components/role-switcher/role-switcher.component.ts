import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { RoleType } from '@secure-tasks-mono/data';
import { RootState } from '../../store';
import {
  selectCurrentRole,
  selectAuthLoading,
} from '../../store/auth/auth.selectors';
import * as AuthActions from '../../store/auth/auth.actions';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

// Helper to map RoleType enum to numeric ID
// This should ideally align with backend Role IDs
const roleTypeToIdMap: Record<RoleType, number> = {
  [RoleType.OWNER]: 1,
  [RoleType.ADMIN]: 2,
  [RoleType.VIEWER]: 3, // Assuming Viewer is 3 based on previous map
};

@Component({
  selector: 'app-role-switcher',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './role-switcher.component.html',
  styleUrls: ['./role-switcher.component.css'],
})
export class RoleSwitcherComponent implements OnInit {
  private readonly store = inject(Store<RootState>);
  public isLoading$: Observable<boolean>;

  public availableRoles: RoleType[] = [
    RoleType.OWNER,
    RoleType.ADMIN,
    RoleType.VIEWER,
  ];
  public selectedRole: RoleType = RoleType.VIEWER;

  constructor() {
    this.isLoading$ = this.store.select(selectAuthLoading);
  }

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
   * Dispatches the roleSwitchAttempt action with the numeric newRoleId
   */
  public handleRoleChange(newRoleType: RoleType): void {
    const newRoleId = roleTypeToIdMap[newRoleType];
    if (newRoleId === undefined) {
      console.error(
        `[RoleSwitcherComponent] Unknown RoleType selected: ${newRoleType}`
      );
      return;
    }
    this.store.dispatch(AuthActions.roleSwitchAttempt({ newRoleId }));
  }
}
