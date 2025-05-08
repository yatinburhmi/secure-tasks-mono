export class OrganizationDto {
  id!: string;
  name!: string;
  parentOrganizationId?: string | null;

  // Optional expanded data
  // parentOrganization?: OrganizationDto;
  // childOrganizations?: OrganizationDto[];

  createdAt!: Date;
  updatedAt!: Date;
}
