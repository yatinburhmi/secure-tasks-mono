import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.state';

// Feature selector
export const selectAuthState = createFeatureSelector<AuthState>('auth');

// Individual selectors
export const selectCurrentUser = createSelector(
  selectAuthState,
  (state) => state.currentUser
);

export const selectCurrentRole = createSelector(
  selectAuthState,
  (state) => state.currentRole
);

export const selectOrganization = createSelector(
  selectAuthState,
  (state) => state.organization
);

export const selectAuthLoading = createSelector(
  selectAuthState,
  (state) => state.isLoading
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state) => state.error
);

// Derived selectors
export const selectIsAuthenticated = createSelector(
  selectCurrentUser,
  (user) => !!user
);

export const selectUserName = createSelector(
  selectCurrentUser,
  (user) => user?.name ?? null
);

export const selectUserPermissions = createSelector(selectCurrentRole, (role) =>
  role ? getRolePermissions(role) : []
);

// Helper function to map roles to permissions (to be implemented based on your permission system)
const getRolePermissions = (role: string): string[] => {
  // This should be implemented based on your actual permission mapping
  // For now, returning an empty array
  return [];
};
