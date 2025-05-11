import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDto } from '@secure-tasks-mono/data';
import { environment } from '../../../environments/environment'; // Import environment

@Injectable({
  providedIn: 'root',
})
export class UsersHttpService {
  // The specific path for users API, to be appended to the base apiUrl from environment
  private readonly usersApiPath = '/api/users';

  constructor(private http: HttpClient) {}

  /**
   * Fetches users belonging to a specific organization from the backend.
   * @param organizationId The ID of the organization.
   * @returns An Observable array of UserDto.
   */
  getUsersByOrganization(organizationId: string): Observable<UserDto[]> {
    if (!organizationId) {
      // Or return of([]) or throw an error, depending on desired handling for invalid input
      console.error('Organization ID must be provided to fetch users.');
      return new Observable<UserDto[]>((observer) =>
        observer.error('Organization ID is required.')
      );
    }
    const params = new HttpParams().set('organizationId', organizationId);
    // Construct the full URL using environment.apiUrl and the specific users API path
    const fullUrl = `${environment.apiUrl}${this.usersApiPath}`;
    return this.http.get<UserDto[]>(fullUrl, { params });
  }

  // You can add other user-related HTTP methods here in the future if needed,
  // e.g., getUserById, updateUser, etc.
}
