import { AuthState } from './auth/auth.state';
import { TasksState } from './tasks/tasks.state';
import { UsersState } from './users/users.state';

export interface RootState {
  auth: AuthState;
  tasks: TasksState;
  users: UsersState;
}
