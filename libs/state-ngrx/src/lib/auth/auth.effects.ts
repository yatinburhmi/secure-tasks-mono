import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { tap } from 'rxjs/operators';

/**
 * Effects for Authentication related actions.
 * This class will house side effects such as API calls for login, logout, etc.
 */
@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);

  constructor() {
    // Console logs removed
  }

  logClearSession$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.clearAuthSession),
        tap((action) =>
          console.log('[AuthEffects] clearAuthSession action detected:', action)
        )
      ),
    { dispatch: false }
  );

  // Example of a future effect (uncomment and adapt as needed):
  /*
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginRequest), // Assuming you create a loginRequest action
      switchMap(action =>
        // this.authApiService.login(action.credentials).pipe(
        //   map(response => AuthActions.loginSuccess({ user: response.user, accessToken: response.token, role: response.role, organization: response.organization })),
        //   catchError(error => of(AuthActions.loginFailure({ error: error.message || 'Login Failed' })))
        // )
        // For mock, you might dispatch success directly or after a delay:
        of(AuthActions.setAuthSession({
          user: { id: 'mock-user-id', username: 'mockUser', email: 'mock@example.com' }, // Replace with actual UserDto structure or mock
          role: RoleType.Viewer, // Example role
          organization: { id: 'mock-org-id', name: 'Mock Org' }, // Replace with actual OrganizationDto or mock
          isAuthenticated: true
        })).pipe(delay(500)) // Simulate API delay
      )
    )
  );
  */

  // Example of a logout effect:
  /*
  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logoutRequest), // Assuming you create a logoutRequest action
      tap(() => {
        // Perform cleanup like removing token from localStorage
        // localStorage.removeItem('accessToken');
      }),
      map(() => AuthActions.clearAuthSession()) // Dispatch clearAuthSession to update state
    ),
    { dispatch: true } // Ensure clearAuthSession is dispatched
  );
  */
}
