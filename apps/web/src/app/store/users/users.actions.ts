import { createAction, props } from '@ngrx/store';
import { UserDto } from '@secure-tasks-mono/data';

export const loadOrgUsers = createAction(
  '[Users Page/API] Load Organization Users',
  props<{ organizationId: string }>()
);

export const loadOrgUsersSuccess = createAction(
  '[Users API] Load Organization Users Success',
  props<{ users: UserDto[] }>()
);

export const loadOrgUsersFailure = createAction(
  '[Users API] Load Organization Users Failure',
  props<{ error: any }>()
);
