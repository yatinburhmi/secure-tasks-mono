import { createReducer, on } from '@ngrx/store';
import {
  login,
  loginSuccess,
  loginFailure,
  logout,
  logoutSuccess,
  switchRole,
  clearAuthError,
} from './auth.actions';
import { initialAuthState } from './auth.state';

export const authReducer = createReducer(
  initialAuthState,

  // Login Actions
  on(login, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(loginSuccess, (state, { user, role, organization }) => ({
    ...state,
    currentUser: user,
    currentRole: role,
    organization,
    isLoading: false,
    error: null,
  })),

  on(loginFailure, (state, { error }) => ({
    ...state,
    currentUser: null,
    currentRole: null,
    organization: null,
    isLoading: false,
    error,
  })),

  // Logout Actions
  on(logout, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(logoutSuccess, () => ({
    ...initialAuthState,
  })),

  // Mock Role Switch Action
  on(switchRole, (state, { role }) => ({
    ...state,
    currentRole: role,
  })),

  // Clear Error
  on(clearAuthError, (state) => ({
    ...state,
    error: null,
  }))
);
