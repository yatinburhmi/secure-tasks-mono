import { createAction, props } from '@ngrx/store';
import { TaskDto } from '@secure-tasks-mono/data';

// Load Tasks
export const loadTasks = createAction('[Tasks] Load Tasks');

export const loadTasksSuccess = createAction(
  '[Tasks] Load Tasks Success',
  props<{ tasks: TaskDto[] }>()
);

export const loadTasksFailure = createAction(
  '[Tasks] Load Tasks Failure',
  props<{ error: string }>()
);

// Create Task
export const createTask = createAction(
  '[Tasks] Create Task',
  props<{ task: Omit<TaskDto, 'id'> }>()
);

export const createTaskSuccess = createAction(
  '[Tasks] Create Task Success',
  props<{ task: TaskDto }>()
);

export const createTaskFailure = createAction(
  '[Tasks] Create Task Failure',
  props<{ error: string }>()
);

// Update Task
export const updateTask = createAction(
  '[Tasks] Update Task',
  props<{ id: string; changes: Partial<TaskDto> }>()
);

export const updateTaskSuccess = createAction(
  '[Tasks] Update Task Success',
  props<{ task: TaskDto }>()
);

export const updateTaskFailure = createAction(
  '[Tasks] Update Task Failure',
  props<{ error: string }>()
);

// Delete Task
export const deleteTask = createAction(
  '[Tasks] Delete Task',
  props<{ id: string }>()
);

export const deleteTaskSuccess = createAction(
  '[Tasks] Delete Task Success',
  props<{ id: string }>()
);

export const deleteTaskFailure = createAction(
  '[Tasks] Delete Task Failure',
  props<{ error: string }>()
);

// Select Task
export const selectTask = createAction(
  '[Tasks] Select Task',
  props<{ id: string | null }>()
);

// Clear Error
export const clearTasksError = createAction('[Tasks] Clear Error');
