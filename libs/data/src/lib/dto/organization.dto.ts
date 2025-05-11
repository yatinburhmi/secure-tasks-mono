import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class OrganizationDto {
  @IsUUID()
  id!: string;

  @IsString()
  name!: string;

  @IsUUID()
  @IsOptional()
  parentOrganizationId?: string | null;

  // Optional expanded data
  // parentOrganization?: OrganizationDto;
  // childOrganizations?: OrganizationDto[];

  @IsString()
  createdAt!: string;

  @IsString()
  updatedAt!: string;
}

export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsUUID()
  @IsOptional()
  parentOrganizationId?: string | null;
}

// Manually define UpdateOrganizationDto to avoid PartialType and its problematic dependencies for frontend
export class UpdateOrganizationDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty() // Retain NotEmpty if you want to ensure that if 'name' is provided, it's not empty.
  // If truly optional and can be empty string if sent, remove NotEmpty.
  name?: string;

  @IsUUID()
  @IsOptional()
  parentOrganizationId?: string | null;
}
