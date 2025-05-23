import { createReducer, on } from '@ngrx/store';
import {
  login,
  loginSuccess,
  loginFailure,
  logout,
  logoutSuccess,
  clearAuthError,
  roleSwitchAttempt,
  roleSwitchSuccess,
  roleSwitchFailure,
  initializeAuth,
  initializeAuthSuccess,
  initializeAuthFailure,
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
    accessToken: null,
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

  // Initialize Auth Actions
  on(initializeAuth, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(
    initializeAuthSuccess,
    (state, { user, role, organization, accessToken }) => ({
      ...state,
      currentUser: user,
      currentRole: role,
      organization,
      accessToken,
      isLoading: false,
      error: null,
    })
  ),

  on(initializeAuthFailure, (state) => ({
    ...state,
    currentUser: null,
    currentRole: null,
    organization: null,
    accessToken: null,
    isLoading: false,
    error: null,
  })),

  // Role Switch Actions
  on(roleSwitchAttempt, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(roleSwitchSuccess, (state, { accessToken, user, role, organization }) => ({
    ...state,
    currentUser: user,
    currentRole: role,
    organization,
    accessToken,
    isLoading: false,
    error: null,
  })),

  on(roleSwitchFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  // Clear Error
  on(clearAuthError, (state) => ({
    ...state,
    error: null,
  }))
);
