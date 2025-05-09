import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksBackendModule } from '@secure-tasks-mono/tasks-backend';
import { AuthModule } from '@secure-tasks-mono/auth'; // Needed for AuthGuard and req.user population

@Module({
  imports: [
    TasksBackendModule,
    AuthModule, // Make AuthModule available for AuthGuard and JwtStrategy effects
  ],
  controllers: [TasksController],
})
export class TasksModule {}
