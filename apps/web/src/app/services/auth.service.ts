import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { UserDto, OrganizationDto, RoleType } from '@secure-tasks-mono/data';
import { environment } from '../../environments/environment';
import { Store } from '@ngrx/store';
import * as AuthActions from '../store/auth/auth.actions';
import { jwtDecode } from 'jwt-decode';

// Matches the backend response for /auth/login
export interface LoginResponse {
  accessToken: string;
}

// Expected structure of the JWT payload from our backend
export interface DecodedJwtPayload {
  sub: string; // User ID
  email: string;
  roleId: number;
  organizationId: string;
  iat?: number;
  exp?: number;
}

const ACCESS_TOKEN_KEY = 'accessToken';

// Helper to map roleId from token to RoleType enum
function mapRoleIdToRoleType(roleId: number): RoleType {
  switch (roleId) {
    case 1:
      return RoleType.OWNER;
    case 2:
      return RoleType.ADMIN;
    // Assuming roleId 3 (if it exists in backend JWTs) should map to VIEWER
    // Or, if your backend doesn't issue roleId 3, this case might not be needed.
    case 3:
      console.warn(
        `RoleId 3 encountered, mapping to VIEWER. Adjust if this is incorrect.`
      );
      return RoleType.VIEWER;
    case 4:
      return RoleType.VIEWER;
    default:
      console.warn(`Unknown roleId: ${roleId}, defaulting to VIEWER`);
      return RoleType.VIEWER;
  }
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private store: Store) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap((response) => {
          if (!response || !response.accessToken) {
            console.error('Login response missing access token.');
            this.store.dispatch(
              AuthActions.loginFailure({
                error: 'Login failed: No access token received.',
              })
            );
            throw new Error('Login failed: No access token received.');
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
              // isActive: true, // Removed as it's not in UserDto
              roleId: decodedToken.roleId,
              organizationId: decodedToken.organizationId,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              // roles: [], // Removed as UserDto might not have it, and role is handled separately
            };

            const role = mapRoleIdToRoleType(decodedToken.roleId);

            const organization: OrganizationDto = {
              id: decodedToken.organizationId,
              name: `Org ${decodedToken.organizationId}`,
              parentOrganizationId: null,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            this.store.dispatch(
              AuthActions.loginSuccess({ user, role, organization })
            );
          } catch (error) {
            console.error(
              'Error decoding token or dispatching loginSuccess:',
              error
            );
            localStorage.removeItem(ACCESS_TOKEN_KEY);
            this.store.dispatch(
              AuthActions.loginFailure({
                error: 'Invalid token received from server. Please try again.',
              })
            );
            throw new Error('Login failed due to an invalid token.');
          }
        }),
        catchError((err) => {
          localStorage.removeItem(ACCESS_TOKEN_KEY);
          const errorMessage =
            err.error?.message ||
            err.message ||
            'An unknown login error occurred.';
          this.store.dispatch(
            AuthActions.loginFailure({ error: errorMessage })
          );
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  logout(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    this.store.dispatch(AuthActions.logoutSuccess());
  }

  getToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  public switchRole(newRoleId: number): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/switch-role`, {
      newRoleId,
    });
    // The NgRx effect will handle the response (saving token, decoding, dispatching success/failure)
  }

  public isAuthenticatedSync(): boolean {
    return !!this.getToken();
  }
}
