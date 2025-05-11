import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { TasksHttpService } from '../../core/services/tasks-http.service';
import * as TasksActions from './tasks.actions';

@Injectable()
export class TasksEffects {
  private readonly actions$ = inject(Actions);
  private readonly tasksHttpService = inject(TasksHttpService);

  readonly loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.loadTasks),
      switchMap(() =>
        this.tasksHttpService.getTasks().pipe(
          map((tasks) => TasksActions.loadTasksSuccess({ tasks })),
          catchError((error) =>
            of(
              TasksActions.loadTasksFailure({
                error: error.message || 'Failed to load tasks',
              })
            )
          )
        )
      )
    )
  );

  readonly createTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.createTask),
      mergeMap((action) =>
        this.tasksHttpService.createTask(action.taskData).pipe(
          map((task) => TasksActions.createTaskSuccess({ task })),
          catchError((error) =>
            of(
              TasksActions.createTaskFailure({
                error: error.message || 'Failed to create task',
              })
            )
          )
        )
      )
    )
  );

  readonly updateTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.updateTask),
      mergeMap((action) =>
        this.tasksHttpService.updateTask(action.id, action.changes).pipe(
          map((task) => TasksActions.updateTaskSuccess({ task })),
          catchError((error) =>
            of(
              TasksActions.updateTaskFailure({
                error: error.message || 'Failed to update task',
              })
            )
          )
        )
      )
    )
  );

  readonly deleteTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.deleteTask),
      mergeMap((action) =>
        this.tasksHttpService.deleteTask(action.id).pipe(
          map((response) =>
            TasksActions.deleteTaskSuccess({ id: response.id })
          ),
          catchError((error) =>
            of(
              TasksActions.deleteTaskFailure({
                error: error.message || 'Failed to delete task',
              })
            )
          )
        )
      )
    )
  );
}
