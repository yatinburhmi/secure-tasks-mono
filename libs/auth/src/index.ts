export * from './lib/auth.module';
export * from './lib/auth.service';
export * from './lib/strategies/jwt.strategy'; // For JwtPayload interface
export * from './lib/guards/permissions.guard';
export * from './lib/decorators/require-permissions.decorator';
export * from './lib/constants/permissions.constants';
// Export PasswordService if it needs to be used directly by other modules (optional)
// export * from './lib/services/password.service'; // Removed as PasswordService moved to @secure-tasks-mono/security
