import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { TasksService } from '../../services/tasks.service';
import { TasksHttpService } from '../../core/services/tasks-http.service';
import * as TasksActions from './tasks.actions';
import * as AuthActions from '../../store/auth/auth.actions';
import { CreateTaskDto, UpdateTaskDto, TaskDto } from '@secure-tasks-mono/data';

// Helper function to convert nulls to undefined for specific DTO fields
function prepareCreateTaskData(
  rawData: Omit<TaskDto, 'id' | 'createdAt' | 'updatedAt'>
): CreateTaskDto {
  const { description, category, dueDate, assigneeId, ...rest } = rawData;
  return {
    title: rest.title,
    status: rest.status,
    creatorId: rest.creatorId,
    organizationId: rest.organizationId,
    description: description === null ? undefined : description,
    category: category === null ? undefined : category,
    dueDate: dueDate === null ? undefined : dueDate,
    assigneeId: assigneeId === null ? undefined : assigneeId,
    tags: rest.tags,
  };
}

function prepareUpdateTaskData(rawData: Partial<TaskDto>): UpdateTaskDto {
  const {
    description,
    category,
    dueDate,
    assigneeId,
    organizationId,
    ...rest
  } = rawData;

  const preparedChanges: UpdateTaskDto = { ...rest };

  if ('description' in rawData) {
    preparedChanges.description =
      rawData.description === null ? undefined : rawData.description;
  }
  if ('category' in rawData) {
    preparedChanges.category =
      rawData.category === null ? undefined : rawData.category;
  }
  if ('dueDate' in rawData) {
    preparedChanges.dueDate =
      rawData.dueDate === null ? undefined : rawData.dueDate;
  }
  if ('assigneeId' in rawData) {
    preparedChanges.assigneeId =
      rawData.assigneeId === null ? undefined : rawData.assigneeId;
  }
  if ('organizationId' in rawData && rawData.organizationId === null) {
    // This case should ideally not happen as organizationId is not nullable in TaskDto.
    // If it could be null and needed to be stripped or set to undefined:
    // preparedChanges.organizationId = undefined; // Or delete preparedChanges.organizationId;
  }

  return preparedChanges;
}

@Injectable()
export class TasksEffects {
  private readonly actions$ = inject(Actions);
  private readonly tasksService = inject(TasksService);
  private readonly tasksHttpService = inject(TasksHttpService);

  readonly loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.loadTasks, AuthActions.roleSwitchSuccess),
      switchMap((action) => {
        let searchTerm: string | undefined = undefined;

        // Check if the action is loadTasks and has queryParams
        if (action.type === TasksActions.loadTasks.type) {
          // Type assertion is safe here because we've checked action.type
          const loadTasksAction = action as ReturnType<
            typeof TasksActions.loadTasks
          >;
          searchTerm = loadTasksAction.queryParams?.searchTerm;
        }
        // For AuthActions.roleSwitchSuccess, searchTerm remains undefined (or its default),
        // which is the desired behavior to reload all tasks for the new role without a search term.

        return this.tasksService.getAllTasks(searchTerm).pipe(
          map((tasks) => TasksActions.loadTasksSuccess({ tasks })),
          catchError((error) =>
            of(
              TasksActions.loadTasksFailure({
                error: error.message || 'Failed to load tasks',
              })
            )
          )
        );
      })
    )
  );

  readonly createTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.createTask),
      mergeMap((action) => {
        const preparedTaskData = prepareCreateTaskData(action.taskData);
        return this.tasksHttpService.createTask(preparedTaskData).pipe(
          map((task) => TasksActions.createTaskSuccess({ task })),
          catchError((error) =>
            of(
              TasksActions.createTaskFailure({
                error: error.message || 'Failed to create task',
              })
            )
          )
        );
      })
    )
  );

  readonly updateTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TasksActions.updateTask),
      mergeMap((action) => {
        const preparedChanges = prepareUpdateTaskData(action.changes);
        return this.tasksHttpService
          .updateTask(action.id, preparedChanges)
          .pipe(
            map((task) => TasksActions.updateTaskSuccess({ task })),
            catchError((error) =>
              of(
                TasksActions.updateTaskFailure({
                  error: error.message || 'Failed to update task',
                })
              )
            )
          );
      })
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
