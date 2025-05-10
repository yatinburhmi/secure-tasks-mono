import { createReducer, on, Action } from '@ngrx/store';
import { AuthState, initialAuthState } from './auth.models';
import * as AuthActions from './auth.actions';

const reducer = createReducer(
  initialAuthState,
  on(
    AuthActions.setAuthSession,
    (state, { user, role, organization, isAuthenticated }) => ({
      ...state,
      user,
      role,
      organization,
      isAuthenticated,
      isLoading: false,
      error: null, // Clear any previous error on successful session set
    })
  ),
  on(AuthActions.clearAuthSession, (state) => ({
    ...initialAuthState, // Reset to initial state on clear
  }))
);

export function authReducer(
  state: AuthState | undefined,
  action: Action
): AuthState {
  return reducer(state, action);
}
