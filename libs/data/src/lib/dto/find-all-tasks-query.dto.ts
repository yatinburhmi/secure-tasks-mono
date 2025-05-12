import { IsOptional, IsUUID, IsString, Length } from 'class-validator';

export class FindAllTasksQueryDto {
  @IsOptional()
  @IsUUID()
  assigneeId?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  searchTerm?: string;

  // Add other query parameters here if needed in the future
}
