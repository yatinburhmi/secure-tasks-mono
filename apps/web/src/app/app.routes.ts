import { Route } from '@angular/router';
// import { DashboardComponent } from './dashboard/dashboard.component'; // Old component
import { DashboardPageComponent } from './features/dashboard/pages/dashboard-page/dashboard-page.component'; // New component
import { LoginComponent } from './login/login.component';

export const appRoutes: Route[] = [
  { path: 'dashboard', component: DashboardPageComponent }, // Updated component
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
];
