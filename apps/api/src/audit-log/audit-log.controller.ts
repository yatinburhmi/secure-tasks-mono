import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  PermissionsGuard,
  RequirePermissions,
  PERM_AUDIT_READ, // Using existing constant
  JwtPayload,
} from '@secure-tasks-mono/auth';
import {
  FindAuditLogQueryDto,
  PaginatedAuditLogResponseDto,
} from '@secure-tasks-mono/data';
import { AuditLogService } from '@secure-tasks-mono/audit-log-backend';

@Controller('audit-logs') // Changed route to 'audit-logs' for plural consistency
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  @RequirePermissions(PERM_AUDIT_READ)
  public async findAllAuditLogs(
    @Query() queryDto: FindAuditLogQueryDto,
    @Req() req: { user: JwtPayload }
  ): Promise<PaginatedAuditLogResponseDto> {
    const { organizationId } = req.user;
    const { logs, total } = await this.auditLogService.findAllLogs(
      organizationId,
      queryDto
    );

    return {
      data: logs, // Assuming logs are already in AuditLogResponseDto format or compatible
      total,
      page: queryDto.page || 1,
      limit: queryDto.limit || 10,
    };
  }
}
