import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolePermission, Permission } from '@secure-tasks-mono/database';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PasswordService } from './services/password.service';
import { AuthService } from './auth.service';
import { PermissionsGuard } from './guards/permissions.guard';

@Module({
  imports: [
    ConfigModule, // Ensure ConfigModule is imported to use ConfigService
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule], // Make ConfigService available in the factory
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '1d',
        },
      }),
      inject: [ConfigService], // Inject ConfigService into the factory
    }),
    TypeOrmModule.forFeature([RolePermission, Permission]),
  ],
  providers: [JwtStrategy, PasswordService, AuthService, PermissionsGuard],
  // Export guard? Usually not needed, it's used via @UseGuards
  exports: [PassportModule, JwtModule, PasswordService, AuthService],
})
export class AuthModule {}
