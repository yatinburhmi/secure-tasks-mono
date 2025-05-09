import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersBackendModule } from '@secure-tasks-mono/users-backend';
import { AuthModule } from '@secure-tasks-mono/auth';

@Module({
  imports: [UsersBackendModule, AuthModule],
  controllers: [UsersController],
})
export class UsersModule {}
