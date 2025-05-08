// Placeholder: Will import relations later when defined
// import { PermissionDto } from './permission.dto';

export class RoleDto {
  id!: string | number;
  name!: string; // OWNER, ADMIN, VIEWER
  description?: string | null;

  // Optional expanded data
  // permissions?: PermissionDto[];

  createdAt!: Date;
  updatedAt!: Date;
}
