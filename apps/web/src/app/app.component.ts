import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RoleSwitcherComponent } from './components/role-switcher/role-switcher.component';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { RoleType } from '@secure-tasks-mono/data';
import { RootState } from './store';
import { selectCurrentRole } from './store/auth/auth.selectors';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, RoleSwitcherComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Task Management';
  private readonly store = inject(Store<RootState>);
  public currentUserRole$: Observable<RoleType | null>;

  constructor() {
    this.currentUserRole$ = this.store.select(selectCurrentRole);
  }
}
