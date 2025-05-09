import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsUUID,
  IsInt,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types'; // For UpdateUserDto
import { Type } from 'class-transformer';

// Placeholder: Will import relations later when defined
// import { RoleDto } from './role.dto';
// import { OrganizationDto } from './organization.dto';

// Basic representation, likely expanded for different contexts (e.g., CreateUserDto)
export class UserDto {
  @IsUUID()
  id!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @IsOptional()
  name?: string | null;

  // isActive!: boolean; // isActive might be managed internally or set by an admin

  @IsUUID()
  @Type(() => Number)
  @IsInt()
  roleId!: number;

  @IsUUID()
  organizationId!: string;
  // Avoid exposing passwordHash

  // Optional expanded data for convenience - commented out until files exist
  // role?: RoleDto;
  // organization?: OrganizationDto;

  createdAt!: Date;
  updatedAt!: Date;
}

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8) // Example: Enforce a minimum password length
  password!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  roleId!: number;

  @IsUUID()
  @IsNotEmpty()
  organizationId!: string;
}

// UpdateUserDto will allow partial updates of CreateUserDto fields
// It can also include specific fields like 'isActive' if that's updatable by users/admins
export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @MinLength(8)
  password?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  roleId?: number;

  @IsUUID()
  @IsOptional()
  organizationId?: string;

  // Example: add other updatable fields if necessary
  // @IsBoolean()
  // @IsOptional()
  // isActive?: boolean;
}
