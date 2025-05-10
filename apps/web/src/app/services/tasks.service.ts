import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaskDto } from '@secure-tasks-mono/data';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private readonly apiUrl = `${environment.apiUrl}/tasks`;

  constructor(private http: HttpClient) {}

  getAllTasks(): Observable<TaskDto[]> {
    return this.http.get<TaskDto[]>(this.apiUrl);
  }

  getTaskById(id: string): Observable<TaskDto> {
    return this.http.get<TaskDto>(`${this.apiUrl}/${id}`);
  }

  createTask(task: Omit<TaskDto, 'id'>): Observable<TaskDto> {
    return this.http.post<TaskDto>(this.apiUrl, task);
  }

  updateTask(id: string, changes: Partial<TaskDto>): Observable<TaskDto> {
    return this.http.patch<TaskDto>(`${this.apiUrl}/${id}`, changes);
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
