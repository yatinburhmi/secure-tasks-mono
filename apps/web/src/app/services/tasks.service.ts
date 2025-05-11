import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { TaskDto } from '@secure-tasks-mono/data';
import { environment } from '../../environments/environment';
import { AuthService, DecodedJwtPayload } from './auth.service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private readonly apiUrl = `${environment.apiUrl}/api/tasks`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAllTasks(): Observable<TaskDto[]> {
    const token = this.authService.getToken();
    if (!token) {
      console.error('No token found, cannot fetch tasks with RBAC.');
      return of([]);
    }

    try {
      const decodedToken = jwtDecode<DecodedJwtPayload>(token);
      const userId = decodedToken.sub;
      const roleId = decodedToken.roleId;

      let requestUrl = this.apiUrl;
      let params = new HttpParams();

      if (roleId === 1) {
        requestUrl = `${this.apiUrl}/all-organizations`;
      } else if (roleId === 3) {
        params = params.set('assigneeId', userId);
      }

      return this.http.get<TaskDto[]>(requestUrl, { params });
    } catch (error) {
      console.error(
        'Error decoding token or constructing task request:',
        error
      );
      return of([]);
    }
  }

  getTaskById(id: string): Observable<TaskDto> {
    return this.http.get<TaskDto>(`${this.apiUrl}/${id}`);
  }

  createTask(task: Omit<TaskDto, 'id'>): Observable<TaskDto> {
    return this.http.post<TaskDto>(this.apiUrl, task);
  }

  updateTask(id: string, changes: Partial<TaskDto>): Observable<TaskDto> {
    const token = this.authService.getToken();
    if (!token) {
      console.error('No token found, cannot update task.');
      return throwError(() => new Error('Authentication required.'));
    }
    try {
      const decodedToken = jwtDecode<DecodedJwtPayload>(token);
      if (decodedToken.roleId === 3) {
        // Viewer
        console.warn('Viewers are not allowed to update tasks.');
        return throwError(
          () => new Error('Forbidden: Viewers cannot update tasks.')
        );
      }
    } catch (error) {
      console.error('Error decoding token during updateTask:', error);
      return throwError(() => new Error('Authentication error.'));
    }
    return this.http.patch<TaskDto>(`${this.apiUrl}/${id}`, changes);
  }

  deleteTask(id: string): Observable<void> {
    const token = this.authService.getToken();
    if (!token) {
      console.error('No token found, cannot delete task.');
      return throwError(() => new Error('Authentication required.'));
    }
    try {
      const decodedToken = jwtDecode<DecodedJwtPayload>(token);
      if (decodedToken.roleId === 3) {
        // Viewer
        console.warn('Viewers are not allowed to delete tasks.');
        return throwError(
          () => new Error('Forbidden: Viewers cannot delete tasks.')
        );
      }
    } catch (error) {
      console.error('Error decoding token during deleteTask:', error);
      return throwError(() => new Error('Authentication error.'));
    }
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
