import { TaskStatus } from '../enums/task-status.enum';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsUUID,
  IsArray,
  ArrayMaxSize,
  Length,
  IsInt,
  Min,
  Max,
} from 'class-validator';
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
  @IsString()
  dueDate?: string | null;

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

  @IsString()
  createdAt!: string;

  @IsString()
  updatedAt!: string;
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
  @IsString()
  dueDate?: string;

  @IsUUID()
  @IsNotEmpty()
  creatorId!: string;

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

export class FindAllTasksFiltersDto {
  @IsOptional()
  @IsUUID()
  assigneeId?: string;

  // We can add other potential filters here in the future, e.g., status, date ranges
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
  @IsString()
  dueDate?: string;

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
