import { UserDto, OrganizationDto, RoleType } from '@secure-tasks-mono/data';

export interface AuthState {
  currentUser: UserDto | null;
  currentRole: RoleType | null;
  organization: OrganizationDto | null;
  isLoading: boolean;
  error: string | null;
}

export const initialAuthState: AuthState = {
  currentUser: null,
  currentRole: null,
  organization: null,
  isLoading: false,
  error: null,
};
