import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TasksState, tasksAdapter } from './tasks.models';
import { tasksFeatureKey } from './tasks.actions';

// Feature Selector for the Tasks state
export const selectTasksState =
  createFeatureSelector<TasksState>(tasksFeatureKey);

// Using the getSelectors method from the adapter to get common selectors
const { selectAll, selectEntities, selectIds, selectTotal } =
  tasksAdapter.getSelectors(selectTasksState);

// Exporting the selectors for use in components/services
export const selectAllTasks = selectAll;
export const selectTaskEntities = selectEntities; // Dictionary of tasks by ID
export const selectTaskIds = selectIds; // Array of task IDs
export const selectTasksTotal = selectTotal; // Total number of tasks

// Selector for a single task by ID
export const selectTaskById = (id: string) =>
  createSelector(selectTaskEntities, (entities) => entities[id]);

// Selector for the loading state
export const selectTasksIsLoading = createSelector(
  selectTasksState,
  (state: TasksState) => state.isLoading
);

// Selector for any tasks error
export const selectTasksError = createSelector(
  selectTasksState,
  (state: TasksState) => state.error
);
