import { TaskStatus } from '../enums/task-status.enum';
// Placeholder: Will import relations later when defined
// import { UserDto } from './user.dto';
// import { OrganizationDto } from './organization.dto';

export class TaskDto {
  id!: string;
  title!: string;
  description?: string | null;
  status!: TaskStatus;
  category?: string | null;
  dueDate?: Date | null;
  creatorId!: string;
  assigneeId?: string | null;
  organizationId!: string;

  // Optional expanded data
  // creator?: UserDto;
  // assignee?: UserDto;
  // organization?: OrganizationDto;

  createdAt!: Date;
  updatedAt!: Date;
}
