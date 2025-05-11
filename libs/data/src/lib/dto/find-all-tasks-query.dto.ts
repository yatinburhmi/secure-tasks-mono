import { IsOptional, IsUUID } from 'class-validator';

export class FindAllTasksQueryDto {
  @IsOptional()
  @IsUUID()
  assigneeId?: string;

  // Add other query parameters here if needed in the future
}
