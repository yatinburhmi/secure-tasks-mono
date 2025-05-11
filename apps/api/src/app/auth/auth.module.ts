import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthModule as LibAuthModule } from '@secure-tasks-mono/auth'; // Import the library AuthModule

@Module({
  imports: [
    LibAuthModule, // Import the library module to make its services (like AuthService) available
  ],
  controllers: [AuthController], // Declare AuthController used by this API app
  // No need to provide AuthService here if it's coming from LibAuthModule
})
export class AuthModule {}
