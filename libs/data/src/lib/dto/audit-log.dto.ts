import { Type } from 'class-transformer';
import {
  IsOptional,
  IsInt,
  IsString,
  IsUUID,
  IsDateString,
  Min,
  Max,
} from 'class-validator';

export class AuditLogResponseDto {
  id!: string;
  timestamp!: Date;
  userId?: string | null;
  organizationId!: string;
  action!: string;
  details?: Record<string, any> | null;

  // You might add userEmail or other looked-up fields here later if needed
}

export class PaginatedAuditLogResponseDto {
  data!: AuditLogResponseDto[];
  total!: number;
  page!: number;
  limit!: number;
}

export class FindAuditLogQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100) // Set a reasonable max limit
  limit?: number = 10;

  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsString()
  action?: string;

  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;

  // We omitted resourceType and resourceId from the simplified entity,
  // but if you add them back later, you'd add them here too.
  // @IsOptional()
  // @IsString()
  // resourceType?: string;

  // @IsOptional()
  // @IsString()
  // resourceId?: string;
}
