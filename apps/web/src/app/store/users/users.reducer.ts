import { createReducer, on } from '@ngrx/store';
import * as UsersActions from './users.actions';
import { initialUsersState, UsersState } from './users.state';

export const usersReducer = createReducer(
  initialUsersState,
  on(UsersActions.loadOrgUsers, (state) => ({
    ...state,
    isLoadingOrganizationUsers: true,
    errorLoadingOrganizationUsers: null,
  })),
  on(UsersActions.loadOrgUsersSuccess, (state, { users }) => ({
    ...state,
    organizationUsers: users,
    isLoadingOrganizationUsers: false,
  })),
  on(UsersActions.loadOrgUsersFailure, (state, { error }) => ({
    ...state,
    isLoadingOrganizationUsers: false,
    errorLoadingOrganizationUsers: error,
  }))
);
