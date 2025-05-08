// Placeholder: Will import relations later when defined
// import { RoleDto } from './role.dto';
// import { OrganizationDto } from './organization.dto';

// Basic representation, likely expanded for different contexts (e.g., CreateUserDto)
export class UserDto {
  id!: string;
  email!: string;
  name?: string | null;
  isActive!: boolean;
  roleId!: string | number; // Depending on Role PK type
  organizationId!: string;
  // Avoid exposing passwordHash

  // Optional expanded data for convenience - commented out until files exist
  // role?: RoleDto;
  // organization?: OrganizationDto;

  createdAt!: Date;
  updatedAt!: Date;
}
