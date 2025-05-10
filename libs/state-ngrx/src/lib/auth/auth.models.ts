import { UserDto, OrganizationDto, RoleType } from '@secure-tasks-mono/data';

/**
 * Interface for the Authentication state.
 */
export interface AuthState {
  isAuthenticated: boolean;
  user: UserDto | null;
  role: RoleType | null; // Or potentially RoleDto if more role details are needed
  organization: OrganizationDto | null;
  accessToken: string | null;
  isLoading: boolean;
  error: string | null; // For storing authentication error messages
}

/**
 * Initial state for Authentication.
 */
export const initialAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
  role: null,
  organization: null,
  accessToken: null,
  isLoading: false,
  error: null,
};
