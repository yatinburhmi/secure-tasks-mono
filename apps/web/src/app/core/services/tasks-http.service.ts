import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { TaskDto, TaskStatus } from '@secure-tasks-mono/data';
import { environment } from '../../../environments/environment'; // Adjusted path

@Injectable({
  providedIn: 'root',
})
export class TasksHttpService {
  private readonly tasksUrl = `${environment.apiUrl}/tasks`;

  // Mock data store
  private mockTasks: TaskDto[] = [
    {
      id: this._generateUUID(),
      title: 'Initial Mock Task 1 (from Service)',
      description: 'This task is loaded from the mock HTTP service.',
      status: TaskStatus.PENDING,
      creatorId: 'user-1',
      organizationId: 'org-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: 'Backend',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: this._generateUUID(),
      title: 'Initial Mock Task 2 (from Service)',
      description: 'Another task from the mock service, to be done soon.',
      status: TaskStatus.IN_PROGRESS,
      assigneeId: 'user-2',
      creatorId: 'user-1',
      organizationId: 'org-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: 'Frontend',
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ['ui', ' urgente'],
    },
  ];

  constructor(private http: HttpClient) {}

  private _generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0,
          v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  getTasks(): Observable<TaskDto[]> {
    // return this.http.get<TaskDto[]>(this.tasksUrl);
    console.log('[TasksHttpService] Fetching mock tasks...');
    return of([...this.mockTasks]).pipe(delay(500));
  }

  createTask(
    taskData: Omit<TaskDto, 'id' | 'createdAt' | 'updatedAt'>
  ): Observable<TaskDto> {
    const newTask: TaskDto = {
      ...taskData,
      id: this._generateUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.mockTasks.push(newTask);
    console.log('[TasksHttpService] Creating mock task:', newTask);
    // return this.http.post<TaskDto>(this.tasksUrl, taskData);
    return of(newTask).pipe(delay(500));
  }

  updateTask(id: string, changes: Partial<TaskDto>): Observable<TaskDto> {
    const taskIndex = this.mockTasks.findIndex((t) => t.id === id);
    if (taskIndex === -1) {
      return of(null as any).pipe(
        delay(500),
        map(() => {
          throw new Error('Task not found');
        })
      ); // Simulate HTTP error
    }
    const updatedTask = {
      ...this.mockTasks[taskIndex],
      ...changes,
      updatedAt: new Date().toISOString(),
    };
    this.mockTasks[taskIndex] = updatedTask;
    console.log('[TasksHttpService] Updating mock task:', updatedTask);
    // return this.http.patch<TaskDto>(`${this.tasksUrl}/${id}`, changes);
    return of(updatedTask).pipe(delay(500));
  }

  deleteTask(id: string): Observable<{ id: string }> {
    const taskIndex = this.mockTasks.findIndex((t) => t.id === id);
    if (taskIndex === -1) {
      return of(null as any).pipe(
        delay(500),
        map(() => {
          throw new Error('Task not found');
        })
      ); // Simulate HTTP error
    }
    this.mockTasks.splice(taskIndex, 1);
    console.log('[TasksHttpService] Deleting mock task with id:', id);
    // return this.http.delete<void>(`${this.tasksUrl}/${id}`).pipe(map(() => ({ id })));
    return of({ id }).pipe(delay(500));
  }
}
