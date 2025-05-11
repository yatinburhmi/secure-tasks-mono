import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UsersState } from './users.state';

// Feature selector for the 'users' state slice
export const selectUsersState = createFeatureSelector<UsersState>('users');

export const selectOrganizationUsersList = createSelector(
  selectUsersState,
  (state: UsersState) => state.organizationUsers
);

export const selectIsLoadingOrganizationUsers = createSelector(
  selectUsersState,
  (state: UsersState) => state.isLoadingOrganizationUsers
);

export const selectErrorLoadingOrganizationUsers = createSelector(
  selectUsersState,
  (state: UsersState) => state.errorLoadingOrganizationUsers
);
