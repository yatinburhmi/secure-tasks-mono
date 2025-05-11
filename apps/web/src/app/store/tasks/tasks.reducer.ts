import { createReducer, on } from '@ngrx/store';
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
  selectTask,
  clearTasksError,
} from './tasks.actions';
import { tasksAdapter, initialTasksState } from './tasks.state';

export const tasksReducer = createReducer(
  initialTasksState,

  // Load Tasks
  on(loadTasks, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(loadTasksSuccess, (state, { tasks }) =>
    tasksAdapter.setAll(tasks, {
      ...state,
      isLoading: false,
      error: null,
    })
  ),

  on(loadTasksFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  // Create Task
  on(createTask, (state) => ({
    ...state,
    isCreating: true,
    error: null,
  })),

  on(createTaskSuccess, (state, { task }) =>
    tasksAdapter.addOne(task, {
      ...state,
      isCreating: false,
      error: null,
    })
  ),

  on(createTaskFailure, (state, { error }) => ({
    ...state,
    isCreating: false,
    error,
  })),

  // Update Task
  on(updateTask, (state) => ({
    ...state,
    isUpdating: true,
    error: null,
  })),

  on(updateTaskSuccess, (state, { task }) =>
    tasksAdapter.updateOne(
      { id: task.id, changes: task },
      {
        ...state,
        isUpdating: false,
        error: null,
      }
    )
  ),

  on(updateTaskFailure, (state, { error }) => ({
    ...state,
    isUpdating: false,
    error,
  })),

  // Delete Task
  on(deleteTask, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(deleteTaskSuccess, (state, { id }) =>
    tasksAdapter.removeOne(id, {
      ...state,
      isLoading: false,
      error: null,
    })
  ),

  on(deleteTaskFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  // Select Task
  on(selectTask, (state, { id }) => ({
    ...state,
    selectedTaskId: id,
  })),

  // Clear Error
  on(clearTasksError, (state) => ({
    ...state,
    error: null,
  }))
);
