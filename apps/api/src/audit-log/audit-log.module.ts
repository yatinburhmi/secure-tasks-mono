import { Module } from '@nestjs/common';
import { AuditLogController } from './audit-log.controller';
import { AuditLogBackendModule } from '@secure-tasks-mono/audit-log-backend';
import { AuthModule } from '@secure-tasks-mono/auth'; // Import AuthModule for guards

@Module({
  imports: [
    AuthModule, // To make AuthGuard and PermissionsGuard available
    AuditLogBackendModule,
  ],
  controllers: [AuditLogController],
})
export class AuditLogApiModule {}
