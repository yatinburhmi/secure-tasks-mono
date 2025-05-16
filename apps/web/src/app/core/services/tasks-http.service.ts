import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TaskDto, CreateTaskDto, UpdateTaskDto } from '@secure-tasks-mono/data';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class TasksHttpService {
  private readonly tasksUrl = `${environment.apiUrl}/api/tasks`;

  constructor(private http: HttpClient) {}

  getTasks(): Observable<TaskDto[]> {
    return this.http.get<TaskDto[]>(this.tasksUrl);
  }

  createTask(taskData: CreateTaskDto): Observable<TaskDto> {
    return this.http.post<TaskDto>(this.tasksUrl, taskData);
  }

  updateTask(id: string, changes: UpdateTaskDto): Observable<TaskDto> {
    return this.http.patch<TaskDto>(`${this.tasksUrl}/${id}`, changes);
  }

  deleteTask(id: string): Observable<{ id: string }> {
    return this.http
      .delete<void>(`${this.tasksUrl}/${id}`)
      .pipe(map(() => ({ id })));
  }
}
