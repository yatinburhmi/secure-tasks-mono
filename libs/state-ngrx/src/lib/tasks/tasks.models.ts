import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { TaskDto } from '@secure-tasks-mono/data';

/**
 * The main state interface for Tasks.
 * Extends EntityState to include IDs and entities for task management,
 * plus custom properties for loading and error status.
 */
export interface TasksState extends EntityState<TaskDto> {
  isLoading: boolean;
  error: string | null;
  // Potentially add selectedTaskId: string | number | null; if needed for detail views
}

/**
 * Entity adapter for TaskDto.
 * Provides utility methods to manage the collection of tasks.
 * We can specify a selectId function if 'id' is not the default primary key name.
 * We can also specify a sortComparer function for default sorting.
 */
export const tasksAdapter: EntityAdapter<TaskDto> =
  createEntityAdapter<TaskDto>({
    // Assuming TaskDto has an 'id' property that is a string or number.
    // selectId: (task: TaskDto) => task.taskId, // Example if your ID property is named differently
    // sortComparer: (a: TaskDto, b: TaskDto) => a.title.localeCompare(b.title), // Example sort by title
  });

/**
 * Initial state for Tasks.
 * Uses the adapter's getInitialState method and adds custom properties.
 */
export const initialTasksState: TasksState = tasksAdapter.getInitialState({
  isLoading: false,
  error: null,
});
