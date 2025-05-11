import { Route } from '@angular/router';
// import { DashboardComponent } from './dashboard/dashboard.component'; // Old component
import { DashboardPageComponent } from './features/dashboard/pages/dashboard-page/dashboard-page.component'; // New component
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';

export const appRoutes: Route[] = [
  {
    path: 'dashboard',
    component: DashboardPageComponent,
    canActivate: [authGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/login',
  },
];
