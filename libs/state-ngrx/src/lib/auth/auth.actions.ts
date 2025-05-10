import { createAction, props } from '@ngrx/store';
import { UserDto, OrganizationDto, RoleType } from '@secure-tasks-mono/data';

export const authFeatureKey = 'auth'; // A unique key for this feature state

/**
 * Action to set the authentication session details.
 * Dispatched when a user's role is selected or mock authentication is established.
 */
export const setAuthSession = createAction(
  '[Auth] Set Auth Session',
  props<{
    user: UserDto | null;
    role: RoleType | null;
    organization: OrganizationDto | null;
    isAuthenticated: boolean;
  }>()
);

/**
 * Action to clear the authentication session details.
 * Dispatched on logout or when the session needs to be invalidated.
 */
export const clearAuthSession = createAction('[Auth] Clear Auth Session');
