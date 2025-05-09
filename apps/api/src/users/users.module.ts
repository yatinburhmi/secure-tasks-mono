import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersBackendModule } from '@secure-tasks-mono/users-backend';

@Module({
  imports: [UsersBackendModule],
  controllers: [UsersController],
})
export class UsersModule {}
