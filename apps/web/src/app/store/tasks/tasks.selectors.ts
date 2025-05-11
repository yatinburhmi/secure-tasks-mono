import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TasksState, tasksAdapter } from './tasks.state';
import { TaskStatus } from '@secure-tasks-mono/data';

// Feature selector
export const selectTasksState = createFeatureSelector<TasksState>('tasks');

// Get the selectors from the adapter
const { selectIds, selectEntities, selectAll, selectTotal } =
  tasksAdapter.getSelectors(selectTasksState);

// Export the entity selectors
export const selectTaskIds = selectIds;
export const selectTaskEntities = selectEntities;
export const selectAllTasks = selectAll;
export const selectTaskTotal = selectTotal;

// Additional state selectors
export const selectSelectedTaskId = createSelector(
  selectTasksState,
  (state) => state.selectedTaskId
);

export const selectTasksLoading = createSelector(
  selectTasksState,
  (state) => state.isLoading
);

export const selectTasksError = createSelector(
  selectTasksState,
  (state) => state.error
);

export const selectTasksCreating = createSelector(
  selectTasksState,
  (state) => state.isCreating
);

export const selectTasksUpdating = createSelector(
  selectTasksState,
  (state) => state.isUpdating
);

// Derived selectors
export const selectSelectedTask = createSelector(
  selectTaskEntities,
  selectSelectedTaskId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : null)
);

// Task status selectors
export const selectTasksByStatus = (status: TaskStatus) =>
  createSelector(selectAllTasks, (tasks) =>
    tasks.filter((task) => task.status === status)
  );

export const selectTaskCountByStatus = (status: TaskStatus) =>
  createSelector(selectTasksByStatus(status), (tasks) => tasks.length);

// Task category selectors
export const selectUniqueCategories = createSelector(
  selectAllTasks,
  (tasks) => [...new Set(tasks.map((task) => task.category).filter(Boolean))]
);

export const selectTasksByCategory = (category: string) =>
  createSelector(selectAllTasks, (tasks) =>
    tasks.filter((task) => task.category === category)
  );

// Task assignment selectors
export const selectAssignedTasks = (userId: string) =>
  createSelector(selectAllTasks, (tasks) =>
    tasks.filter((task) => task.assigneeId === userId)
  );

export const selectUnassignedTasks = createSelector(selectAllTasks, (tasks) =>
  tasks.filter((task) => !task.assigneeId)
);
