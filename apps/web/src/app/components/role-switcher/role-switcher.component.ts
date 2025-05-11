import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { RoleType } from '@secure-tasks-mono/data';
import { switchRole } from '../../store/auth/auth.actions';

@Component({
  selector: 'app-role-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './role-switcher.component.html',
  styleUrls: ['./role-switcher.component.css'],
})
export class RoleSwitcherComponent {
  private readonly store = inject(Store);

  // Define roles directly to prevent dynamic requires
  readonly roles: RoleType[] = [
    RoleType.OWNER,
    RoleType.ADMIN,
    RoleType.VIEWER,
  ];

  /**
   * Handles role change event from the select element
   * @param event Change event from select element
   */
  handleRoleChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const role = select.value as RoleType;
    this.store.dispatch(switchRole({ role }));
  }
}
