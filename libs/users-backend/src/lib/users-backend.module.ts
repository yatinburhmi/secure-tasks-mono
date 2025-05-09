import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@secure-tasks-mono/database'; // Changed to User
import { UsersBackendService } from './users-backend.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Changed to User
  providers: [UsersBackendService],
  exports: [UsersBackendService],
})
export class UsersBackendModule {}
