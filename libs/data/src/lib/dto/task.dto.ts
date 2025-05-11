import { TaskStatus } from '../enums/task-status.enum';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsUUID,
  IsDate,
  IsArray,
  ArrayMaxSize,
  Length,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
// Placeholder: Will import relations later when defined
// import { UserDto } from './user.dto';
// import { OrganizationDto } from './organization.dto';

export class TaskDto {
  @IsUUID()
  id!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsEnum(TaskStatus)
  @IsNotEmpty()
  status!: TaskStatus;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  category?: string | null;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dueDate?: Date | null;

  // Assuming creatorId is a UUID string linking to a User entity
  @IsUUID()
  creatorId!: string;

  @IsOptional()
  @IsUUID()
  assigneeId?: string | null;

  @IsUUID()
  organizationId!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(10)
  tags?: string[];

  // Optional expanded data
  // creator?: UserDto;
  // assignee?: UserDto;
  // organization?: OrganizationDto;

  @Type(() => Date)
  @IsDate()
  createdAt!: Date;

  @Type(() => Date)
  @IsDate()
  updatedAt!: Date;
}

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 255)
  title!: string;

  @IsOptional()
  @IsString()
  @Length(0, 1000)
  description?: string;

  @IsEnum(TaskStatus)
  @IsNotEmpty()
  status!: TaskStatus; // Consider a default value in the service if appropriate

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  priority?: number; // e.g., 1 (Highest) to 5 (Lowest)

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dueDate?: Date;

  @IsOptional()
  @IsUUID()
  assigneeId?: string;

  @IsUUID()
  @IsNotEmpty()
  organizationId!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(10)
  tags?: string[];

  @IsOptional()
  @IsString()
  @Length(1, 50)
  category?: string;
}

// Manually define UpdateTaskDto to avoid PartialType
export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty() // If title is provided, it must not be empty
  @Length(3, 255)
  title?: string;

  @IsOptional()
  @IsString()
  @Length(0, 1000)
  description?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  priority?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dueDate?: Date;

  @IsOptional()
  @IsUUID()
  assigneeId?: string;

  // organizationId is typically not updatable on an existing task,
  // but the controller checks for it to prevent unauthorized changes.
  @IsOptional()
  @IsUUID()
  @IsNotEmpty() // If provided, it must be a valid UUID
  organizationId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(10)
  tags?: string[];

  @IsOptional()
  @IsString()
  @Length(1, 50)
  category?: string;
}
