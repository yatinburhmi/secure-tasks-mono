import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@secure-tasks-mono/database'; // Changed to User
import { UsersBackendService } from './users-backend.service';
import { AuthModule } from '@secure-tasks-mono/auth';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule],
  providers: [UsersBackendService],
  exports: [UsersBackendService],
})
export class UsersBackendModule {}
