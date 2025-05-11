import { UserDto } from '@secure-tasks-mono/data';

export interface UsersState {
  organizationUsers: UserDto[];
  isLoadingOrganizationUsers: boolean;
  errorLoadingOrganizationUsers: any | null;
}

export const initialUsersState: UsersState = {
  organizationUsers: [],
  isLoadingOrganizationUsers: false,
  errorLoadingOrganizationUsers: null,
};
