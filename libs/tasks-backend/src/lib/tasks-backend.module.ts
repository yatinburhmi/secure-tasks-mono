import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '@secure-tasks-mono/database';
import { TasksBackendService } from './tasks-backend.service';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  providers: [TasksBackendService],
  exports: [TasksBackendService],
})
export class TasksBackendModule {}
