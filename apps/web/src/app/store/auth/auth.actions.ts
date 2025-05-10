import { createAction, props } from '@ngrx/store';
import { UserDto, OrganizationDto, RoleType } from '@secure-tasks-mono/data';

// Login Actions
export const login = createAction(
  '[Auth] Login',
  props<{ username: string; password: string }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{
    user: UserDto;
    role: RoleType;
    organization: OrganizationDto;
  }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

// Logout Actions
export const logout = createAction('[Auth] Logout');
export const logoutSuccess = createAction('[Auth] Logout Success');

// Mock Role Switch Actions (for development)
export const switchRole = createAction(
  '[Auth] Switch Role',
  props<{ role: RoleType }>()
);

// Clear Error Action
export const clearAuthError = createAction('[Auth] Clear Error');
