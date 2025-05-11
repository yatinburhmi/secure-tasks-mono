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

// Initialize Auth Actions
export const initializeAuth = createAction('[Auth] Initialize Auth');

export const initializeAuthSuccess = createAction(
  '[Auth] Initialize Auth Success',
  props<{
    user: UserDto;
    role: RoleType;
    organization: OrganizationDto;
    accessToken: string; // Include accessToken to store it if needed
  }>()
);

export const initializeAuthFailure = createAction(
  '[Auth] Initialize Auth Failure'
);

// Role Switch Actions
export const roleSwitchAttempt = createAction(
  '[Auth API] Role Switch Attempt',
  props<{ newRoleId: number }>()
);

export const roleSwitchSuccess = createAction(
  '[Auth API] Role Switch Success',
  props<{
    accessToken: string;
    user: UserDto;
    role: RoleType;
    organization: OrganizationDto;
  }>()
);

export const roleSwitchFailure = createAction(
  '[Auth API] Role Switch Failure',
  props<{ error: any }>()
);

// Clear Error Action
export const clearAuthError = createAction('[Auth] Clear Error');
