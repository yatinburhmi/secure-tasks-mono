import { createReducer, on, Action } from '@ngrx/store';
import { TasksState, initialTasksState, tasksAdapter } from './tasks.models';
import * as TasksActions from './tasks.actions';

const reducer = createReducer(
  initialTasksState,

  // Load Tasks
  on(TasksActions.loadTasks, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(TasksActions.loadTasksSuccess, (state, { tasks }) =>
    tasksAdapter.setAll(tasks, {
      ...state,
      isLoading: false,
      error: null,
    })
  ),
  on(TasksActions.loadTasksFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  // Add Task
  on(TasksActions.addTask, (state) => ({
    // Omit<TaskDto, 'id'> implies backend generates ID
    ...state,
    isLoading: true, // Or a specific creating flag e.g., isCreating: true
    error: null,
  })),
  on(TasksActions.addTaskSuccess, (state, { task }) =>
    tasksAdapter.addOne(task, {
      ...state,
      isLoading: false,
    })
  ),
  on(TasksActions.addTaskFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  // Update Task
  on(TasksActions.updateTask, (state) => ({
    ...state,
    isLoading: true, // Or a specific updating flag e.g., isUpdating: true
    error: null,
  })),
  on(TasksActions.updateTaskSuccess, (state, { task }) =>
    tasksAdapter.updateOne(task, {
      ...state,
      isLoading: false,
    })
  ),
  on(TasksActions.updateTaskFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  // Delete Task
  on(TasksActions.deleteTask, (state, { id }) => ({
    ...state,
    isLoading: true, // Or a specific deleting flag e.g., isDeleting: true
    error: null,
  })),
  on(TasksActions.deleteTaskSuccess, (state, { id }) =>
    tasksAdapter.removeOne(id, {
      ...state,
      isLoading: false,
    })
  ),
  on(TasksActions.deleteTaskFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  }))
);

export function tasksReducer(
  state: TasksState | undefined,
  action: Action
): TasksState {
  return reducer(state, action);
}
