import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolePermission, Permission } from '@secure-tasks-mono/database';
import { SecurityModule } from '@secure-tasks-mono/security';
import { UsersBackendModule } from '@secure-tasks-mono/users-backend';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthService } from './auth.service';
import { PermissionsGuard } from './guards/permissions.guard';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '1d',
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([RolePermission, Permission]),
    SecurityModule,
    UsersBackendModule,
  ],
  providers: [JwtStrategy, AuthService, PermissionsGuard],
  exports: [
    PassportModule,
    JwtModule,
    AuthService,
    SecurityModule,
    UsersBackendModule,
  ],
})
export class AuthModule {}
