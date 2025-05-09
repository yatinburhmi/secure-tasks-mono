import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types'; // For Update DTO

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

  createdAt!: Date;
  updatedAt!: Date;
}

export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsUUID()
  @IsOptional()
  parentOrganizationId?: string | null;
}

export class UpdateOrganizationDto extends PartialType(CreateOrganizationDto) {}
