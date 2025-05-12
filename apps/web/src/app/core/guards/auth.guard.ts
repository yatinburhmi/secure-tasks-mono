import { Injectable, inject } from '@angular/core';
import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { AuthState } from '../../store';

// Functional guard approach for Angular 15+
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean> | Promise<boolean> | boolean => {
  const store = inject(Store<AuthState>);
  const router = inject(Router);

  // For now, let's consider a user authenticated if a token exists in localStorage
  // This is a simplification. A more robust check would involve validating the token
  // or relying purely on NgRx state that is populated after token validation.
  const token = localStorage.getItem('accessToken'); // ACCESS_TOKEN_KEY from AuthService

  if (token) {
    // Optionally, dispatch an action here if the store might not be initialized
    // e.g., if the user reloads the page on a protected route and the store needs to be rehydrated.
    // For now, we assume if a token is present, the user *was* authenticated.
    // A better approach would be to have an NgRx selector like selectIsAuthenticated
    // that also considers token validity or user presence in store.
    return true;
  }

  // If no token, redirect to login page
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;

  // ---- More NgRx integrated approach (preferred for later) ----
  // return store.pipe(
  //   select(selectIsAuthenticated), // This selector needs to be created
  //   take(1),
  //   map(isAuthenticated => {
  //     if (isAuthenticated) {
  //       return true;
  //     }
  //     router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  //     return false;
  //   })
  // );
};

// If we needed a class-based guard (e.g., for older Angular or different DI needs):
// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuard  {
//   constructor(private store: Store<AuthState>, private router: Router) {}

//   canActivate(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
//     return this.store.pipe(
//       select(selectIsAuthenticated),
//       take(1),
//       map(isAuthenticated => {
//         if (isAuthenticated) {
//           return true;
//         }
//         this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
//         return false;
//       })
//     );
//   }
// }
