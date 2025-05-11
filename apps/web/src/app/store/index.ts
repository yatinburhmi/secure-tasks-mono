export * from './root-state';
export * from './auth/auth.state';
export * from './auth/auth.actions';
export * from './auth/auth.reducer';
export * from './auth/auth.selectors';
export * from './auth/auth.effects';
export * from './tasks/tasks.state';
export * from './tasks/tasks.actions';
export * from './tasks/tasks.reducer';
export * from './tasks/tasks.selectors';
export * from './tasks/tasks.effects';
export * from './users/users.state';
export * from './users/users.actions';
export * from './users/users.reducer';
export * from './users/users.selectors';
export * from './users/users.effects';

import { ActionReducerMap } from '@ngrx/store';
import { RootState } from './root-state';
import { authReducer } from './auth/auth.reducer';
import { tasksReducer } from './tasks/tasks.reducer';
import { usersReducer } from './users/users.reducer';
import { AuthEffects } from './auth/auth.effects';
import { TasksEffects } from './tasks/tasks.effects';
import { UsersEffects } from './users/users.effects';

export const rootReducer: ActionReducerMap<RootState> = {
  auth: authReducer,
  tasks: tasksReducer,
  users: usersReducer,
};

export const rootEffects = [AuthEffects, TasksEffects, UsersEffects];
