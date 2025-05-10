import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, delay, mergeMap } from 'rxjs/operators';
import * as TasksActions from './tasks.actions';
import { TaskDto } from '@secure-tasks-mono/data'; // For mock data

// Placeholder for a future API service
// interface TasksApiService {
//   getTasks: () => Observable<TaskDto[]>;
//   createTask: (task: Omit<TaskDto, 'id'>) => Observable<TaskDto>;
//   updateTask: (taskUpdate: Update<TaskDto>) => Observable<Update<TaskDto>>; // Or TaskDto
//   deleteTask: (id: string) => Observable<{ id: string }>; // Or void
// }

@Injectable()
export class TasksEffects {
  private actions$ = inject(Actions);

  constructor() {
    // Console logs removed
  }

  // Effect to load tasks
  loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.loadTasks),
      switchMap(() => {
        // SIMULATED API CALL
        // Replace with: this.tasksApiService.getTasks().pipe(...)
        const mockTasks: TaskDto[] = [
          // Add some mock TaskDto objects here if needed for immediate testing
          // { id: '1', title: 'Mock Task 1', status: TaskStatus.OPEN, description: 'Desc 1', creatorId: 'user1', organizationId: 'org1', createdAt: new Date(), updatedAt: new Date() },
          // { id: '2', title: 'Mock Task 2', status: TaskStatus.IN_PROGRESS, description: 'Desc 2', creatorId: 'user1', organizationId: 'org1', createdAt: new Date(), updatedAt: new Date() },
        ];
        return of(TasksActions.loadTasksSuccess({ tasks: mockTasks })).pipe(
          delay(500) // Simulate network latency
        );
        // Example with error handling:
        // return this.tasksApiService.getTasks().pipe(
        //   map(tasks => TasksActions.loadTasksSuccess({ tasks })),
        //   catchError(error => of(TasksActions.loadTasksFailure({ error })))
        // );
      })
    )
  );

  // Effect to add a task
  addTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.addTask),
      mergeMap(({ task }) => {
        // SIMULATED API CALL
        // Replace with: this.tasksApiService.createTask(task).pipe(...)
        const newTaskWithId: TaskDto = {
          ...task,
          id: crypto.randomUUID(), // Simulate backend generating an ID
          // Ensure all required TaskDto fields are present, e.g., createdAt, updatedAt, creatorId
          // These would normally be set by the backend or in a more sophisticated mock service
          createdAt: new Date(),
          updatedAt: new Date(),
          // creatorId: 'current-user-id', // This would come from auth state or similar
        } as TaskDto; // Cast if Omit<> makes it not fully a TaskDto
        return of(TasksActions.addTaskSuccess({ task: newTaskWithId })).pipe(
          delay(500)
        );
        // Example with error handling:
        // return this.tasksApiService.createTask(task).pipe(
        //   map(newTask => TasksActions.addTaskSuccess({ task: newTask })),
        //   catchError(error => of(TasksActions.addTaskFailure({ error })))
        // );
      })
    )
  );

  // Effect to update a task
  updateTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.updateTask),
      mergeMap(({ task }) => {
        // SIMULATED API CALL
        // Replace with: this.tasksApiService.updateTask(task).pipe(...)
        // The NgRx Update<T> object has an id and a changes object.
        // A real API might expect the full updated DTO or a partial one.
        return of(TasksActions.updateTaskSuccess({ task })).pipe(delay(500));
        // Example with error handling:
        // return this.tasksApiService.updateTask(task).pipe(
        //   map(updatedTask => TasksActions.updateTaskSuccess({ task: updatedTask })),
        //   catchError(error => of(TasksActions.updateTaskFailure({ error })))
        // );
      })
    )
  );

  // Effect to delete a task
  deleteTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.deleteTask),
      mergeMap(({ id }) => {
        // SIMULATED API CALL
        // Replace with: this.tasksApiService.deleteTask(id).pipe(...)
        return of(TasksActions.deleteTaskSuccess({ id })).pipe(delay(500));
        // Example with error handling:
        // return this.tasksApiService.deleteTask(id).pipe(
        //   map(() => TasksActions.deleteTaskSuccess({ id })),
        //   catchError(error => of(TasksActions.deleteTaskFailure({ error })))
        // );
      })
    )
  );
}
