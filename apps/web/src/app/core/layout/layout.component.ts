import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
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
export class LayoutComponent implements OnDestroy {
  isAuthenticated$: Observable<boolean>;
  isOnLoginPage = false;
  private routerSubscription: Subscription;

  constructor(
    private store: Store<AuthState>,
    private authService: AuthService,
    private router: Router
  ) {
    this.isAuthenticated$ = this.store.pipe(select(selectIsAuthenticated));

    this.routerSubscription = this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        ),
        map(
          (event: NavigationEnd) =>
            event.urlAfterRedirects === '/login' ||
            event.urlAfterRedirects === '/auth/login'
        )
      )
      .subscribe((isOnLogin: boolean) => {
        this.isOnLoginPage = isOnLogin;
      });
  }

  handleLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
    // Note: AuthEffects also navigates to /login on logoutSuccess action.
    // This component-level navigation provides immediate feedback.
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}
