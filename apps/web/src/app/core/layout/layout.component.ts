import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { RoleSwitcherComponent } from '../../components/role-switcher/role-switcher.component';
import { ThemeToggleComponent } from '../components/theme-toggle/theme-toggle.component';
import { selectIsAuthenticated } from '../../store/auth/auth.selectors';
import { AuthState } from '../../store/auth/auth.state';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RoleSwitcherComponent,
    ThemeToggleComponent,
  ],
  templateUrl: './layout.component.html',
  styleUrls: [], // Using Tailwind, so no specific component styles needed here
})
export class LayoutComponent {
  isAuthenticated$: Observable<boolean>;

  constructor(
    private store: Store<AuthState>,
    private authService: AuthService,
    private router: Router
  ) {
    this.isAuthenticated$ = this.store.pipe(select(selectIsAuthenticated));
  }

  handleLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
    // Note: AuthEffects also navigates to /login on logoutSuccess action.
    // This component-level navigation provides immediate feedback.
  }
}
