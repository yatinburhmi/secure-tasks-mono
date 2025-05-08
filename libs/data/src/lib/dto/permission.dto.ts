export class PermissionDto {
  id!: string | number;
  key!: string; // e.g., task:create
  description?: string | null;

  createdAt!: Date;
  updatedAt!: Date;
}
