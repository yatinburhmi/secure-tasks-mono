import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { TaskDto } from '@secure-tasks-mono/data';

export interface TasksState extends EntityState<TaskDto> {
  selectedTaskId: string | null;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  error: string | null;
}

export const tasksAdapter = createEntityAdapter<TaskDto>({
  selectId: (task: TaskDto) => task.id,
});

export const initialTasksState: TasksState = tasksAdapter.getInitialState({
  selectedTaskId: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  error: null,
});
