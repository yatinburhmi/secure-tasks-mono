import { AuthState } from './auth/auth.state';
import { TasksState } from './tasks/tasks.state';

export interface RootState {
  auth: AuthState;
  tasks: TasksState;
}
