import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthModule as LibAuthModule } from '@secure-tasks-mono/auth'; // Service from libs/auth

@Module({
  imports: [
    LibAuthModule, // Import the core AuthModule from the library
  ],
  controllers: [AuthController],
})
export class AuthModule {}
