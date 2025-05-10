import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {
  login,
  loginSuccess,
  loginFailure,
  logout,
  logoutSuccess,
  switchRole,
} from './auth.actions';

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      exhaustMap(({ username, password }) =>
        this.authService.login(username, password).pipe(
          map((response) => loginSuccess(response)),
          catchError((error) => of(loginFailure({ error: error.message })))
        )
      )
    )
  );

  readonly loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginSuccess),
        tap(() => {
          // Navigate to dashboard on successful login
          this.router.navigate(['/dashboard']);
        })
      ),
    { dispatch: false }
  );

  readonly logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logout),
      exhaustMap(() =>
        this.authService.logout().pipe(
          map(() => logoutSuccess()),
          catchError(() => of(logoutSuccess())) // Always succeed logout
        )
      )
    )
  );

  readonly logoutSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(logoutSuccess),
        tap(() => {
          // Navigate to login page on logout
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );

  // Development only
  readonly switchRole$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(switchRole),
        exhaustMap(({ role }) => this.authService.switchRole(role))
      ),
    { dispatch: false }
  );
}
