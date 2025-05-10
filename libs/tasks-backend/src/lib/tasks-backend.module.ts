import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '@secure-tasks-mono/database';
import { TasksBackendService } from './tasks-backend.service';
import { AuditLogBackendModule } from '@secure-tasks-mono/audit-log-backend';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), AuditLogBackendModule],
  providers: [TasksBackendService],
  exports: [TasksBackendService],
})
export class TasksBackendModule {}
