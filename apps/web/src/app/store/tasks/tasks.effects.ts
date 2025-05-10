import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, concatMap } from 'rxjs/operators';
import { TasksService } from '../../services/tasks.service';
import {
  loadTasks,
  loadTasksSuccess,
  loadTasksFailure,
  createTask,
  createTaskSuccess,
  createTaskFailure,
  updateTask,
  updateTaskSuccess,
  updateTaskFailure,
  deleteTask,
  deleteTaskSuccess,
  deleteTaskFailure,
} from './tasks.actions';

@Injectable()
export class TasksEffects {
  private readonly actions$ = inject(Actions);
  private readonly tasksService = inject(TasksService);

  readonly loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTasks),
      exhaustMap(() =>
        this.tasksService.getAllTasks().pipe(
          map((tasks) => loadTasksSuccess({ tasks })),
          catchError((error) => of(loadTasksFailure({ error: error.message })))
        )
      )
    )
  );

  readonly createTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createTask),
      concatMap(({ task }) =>
        this.tasksService.createTask(task).pipe(
          map((createdTask) => createTaskSuccess({ task: createdTask })),
          catchError((error) => of(createTaskFailure({ error: error.message })))
        )
      )
    )
  );

  readonly updateTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateTask),
      concatMap(({ id, changes }) =>
        this.tasksService.updateTask(id, changes).pipe(
          map((updatedTask) => updateTaskSuccess({ task: updatedTask })),
          catchError((error) => of(updateTaskFailure({ error: error.message })))
        )
      )
    )
  );

  readonly deleteTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteTask),
      concatMap(({ id }) =>
        this.tasksService.deleteTask(id).pipe(
          map(() => deleteTaskSuccess({ id })),
          catchError((error) => of(deleteTaskFailure({ error: error.message })))
        )
      )
    )
  );
}
