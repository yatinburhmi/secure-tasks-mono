import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@secure-tasks-mono/database'; // Changed to User
import { UsersBackendService } from './users-backend.service';
import { SecurityModule } from '@secure-tasks-mono/security'; // Changed from AuthModule

@Module({
  imports: [TypeOrmModule.forFeature([User]), SecurityModule], // Changed from AuthModule
  providers: [UsersBackendService],
  exports: [UsersBackendService],
})
export class UsersBackendModule {}
