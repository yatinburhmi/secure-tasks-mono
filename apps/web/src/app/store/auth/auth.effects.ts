import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, EMPTY } from 'rxjs';
import { switchMap, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import * as AuthActions from './auth.actions';
import { LoginResponse, DecodedJwtPayload } from '../../services/auth.service';
import { jwtDecode } from 'jwt-decode';
import { UserDto, OrganizationDto, RoleType } from '@secure-tasks-mono/data';

const ACCESS_TOKEN_KEY = 'accessToken';

function mapRoleIdToRoleType(roleId: number): RoleType {
  switch (roleId) {
    case 1:
      return RoleType.OWNER;
    case 2:
      return RoleType.ADMIN;
    case 4:
      return RoleType.VIEWER;
    default:
      console.warn(
        `[AuthEffects] Unknown roleId: ${roleId}, defaulting to VIEWER`
      );
      return RoleType.VIEWER;
  }
}

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly initializeAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.initializeAuth),
      switchMap(() => {
        const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
        if (!accessToken) {
          return of(AuthActions.initializeAuthFailure());
        }

        try {
          const decodedToken = jwtDecode<DecodedJwtPayload>(accessToken);
          // Optional: Check token expiration (decodedToken.exp)
          const currentTime = Math.floor(Date.now() / 1000);
          if (decodedToken.exp && decodedToken.exp < currentTime) {
            localStorage.removeItem(ACCESS_TOKEN_KEY);
            return of(AuthActions.initializeAuthFailure());
          }

          const user: UserDto = {
            id: decodedToken.sub,
            email: decodedToken.email,
            name: decodedToken.email, // Or a dedicated name claim if available
            roleId: decodedToken.roleId,
            organizationId: decodedToken.organizationId,
            // These dates might not be accurate if only from token, consider fetching full user profile
            createdAt: new Date(
              decodedToken.iat ? decodedToken.iat * 1000 : Date.now()
            ),
            updatedAt: new Date(
              decodedToken.iat ? decodedToken.iat * 1000 : Date.now()
            ),
          };
          const role = mapRoleIdToRoleType(decodedToken.roleId);
          const organization: OrganizationDto = {
            id: decodedToken.organizationId,
            name: `Org ${decodedToken.organizationId}`, // Or a dedicated org name claim
            parentOrganizationId: null, // This info might not be in the token
            createdAt: new Date(
              decodedToken.iat ? decodedToken.iat * 1000 : Date.now()
            ),
            updatedAt: new Date(
              decodedToken.iat ? decodedToken.iat * 1000 : Date.now()
            ),
          };

          return of(
            AuthActions.initializeAuthSuccess({
              user,
              role,
              organization,
              accessToken,
            })
          );
        } catch (error) {
          console.error(
            '[AuthEffects:initializeAuth$] Error processing token:',
            error
          );
          localStorage.removeItem(ACCESS_TOKEN_KEY);
          return of(AuthActions.initializeAuthFailure());
        }
      })
    )
  );

  readonly login$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.login),
        switchMap(({ username, password }) =>
          this.authService.login(username, password).pipe(
            catchError((error) => {
              console.error(
                '[AuthEffects:login$] Error caught after AuthService.login call: ',
                error
              );
              return EMPTY;
            })
          )
        )
      ),
    { dispatch: false }
  );

  readonly loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => {
          this.router.navigate(['/dashboard']);
        })
      ),
    { dispatch: false }
  );

  readonly logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          this.authService.logout();
        })
      ),
    { dispatch: false }
  );

  readonly logoutSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logoutSuccess),
        tap(() => {
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );

  readonly roleSwitchEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.roleSwitchAttempt),
      switchMap(({ newRoleId }) =>
        this.authService.switchRole(newRoleId).pipe(
          switchMap((response: LoginResponse) => {
            if (!response || !response.accessToken) {
              console.error(
                '[AuthEffects:roleSwitchEffect$] Response missing access token.'
              );
              return of(
                AuthActions.roleSwitchFailure({
                  error: 'Role switch failed: No access token received.',
                })
              );
            }
            localStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken);
            try {
              const decodedToken = jwtDecode<DecodedJwtPayload>(
                response.accessToken
              );
              const user: UserDto = {
                id: decodedToken.sub,
                email: decodedToken.email,
                name: decodedToken.email,
                roleId: decodedToken.roleId,
                organizationId: decodedToken.organizationId,
                createdAt: new Date(),
                updatedAt: new Date(),
              };
              const role = mapRoleIdToRoleType(decodedToken.roleId);
              const organization: OrganizationDto = {
                id: decodedToken.organizationId,
                name: `Org ${decodedToken.organizationId}`,
                parentOrganizationId: null,
                createdAt: new Date(),
                updatedAt: new Date(),
              };
              return of(
                AuthActions.roleSwitchSuccess({
                  accessToken: response.accessToken,
                  user,
                  role,
                  organization,
                })
              );
            } catch (error) {
              console.error(
                '[AuthEffects:roleSwitchEffect$] Error decoding token or creating success payload:',
                error
              );
              localStorage.removeItem(ACCESS_TOKEN_KEY);
              return of(
                AuthActions.roleSwitchFailure({
                  error: 'Invalid token received after role switch.',
                })
              );
            }
          }),
          catchError((error) => {
            const errorMessage =
              error.error?.message ||
              error.message ||
              'An unknown error occurred during role switch.';
            return of(AuthActions.roleSwitchFailure({ error: errorMessage }));
          })
        )
      )
    )
  );
}
