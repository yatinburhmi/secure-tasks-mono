import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserDto, OrganizationDto, RoleType } from '@secure-tasks-mono/data';
import { environment } from '../../environments/environment';

export interface LoginResponse {
  user: UserDto;
  accessToken: string;
}

export interface AuthResponse {
  user: UserDto;
  role: RoleType;
  organization: OrganizationDto;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/login`, { username, password })
      .pipe(
        map((response) => {
          // Store the token
          localStorage.setItem('accessToken', response.accessToken);

          // Mock response for now - this should come from the API
          return {
            user: response.user,
            role: 'ADMIN' as RoleType, // Mock role
            organization: {
              id: '1',
              name: 'Default Organization',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          };
        })
      );
  }

  logout(): Observable<void> {
    return new Observable((subscriber) => {
      localStorage.removeItem('accessToken');
      subscriber.next();
      subscriber.complete();
    });
  }

  // For development only
  switchRole(role: RoleType): Observable<RoleType> {
    return new Observable((subscriber) => {
      subscriber.next(role);
      subscriber.complete();
    });
  }
}
