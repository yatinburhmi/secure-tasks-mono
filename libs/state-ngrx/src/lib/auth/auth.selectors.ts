import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.models';
import { authFeatureKey } from './auth.actions';

// Feature Selector for the Auth state
export const selectAuthState = createFeatureSelector<AuthState>(authFeatureKey);

// Selector for isAuthenticated
export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state: AuthState) => state.isAuthenticated
);

// Selector for the current user
export const selectCurrentUser = createSelector(
  selectAuthState,
  (state: AuthState) => state.user
);

// Selector for the current role
export const selectCurrentRole = createSelector(
  selectAuthState,
  (state: AuthState) => state.role
);

// Selector for the current organization
export const selectCurrentOrganization = createSelector(
  selectAuthState,
  (state: AuthState) => state.organization
);

// Selector for the loading state
export const selectAuthIsLoading = createSelector(
  selectAuthState,
  (state: AuthState) => state.isLoading
);

// Selector for any authentication error
export const selectAuthError = createSelector(
  selectAuthState,
  (state: AuthState) => state.error
);
