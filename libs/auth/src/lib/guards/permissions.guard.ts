import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/require-permissions.decorator';
import { AuthService } from '../auth.service';
import { JwtPayload } from '../strategies/jwt.strategy';

@Injectable()
export class PermissionsGuard implements CanActivate {
  private readonly logger = new Logger(PermissionsGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;

    if (!user || !user.roleId) {
      this.logger.warn(
        'PermissionsGuard: User object or roleId not found on request. Ensure AuthGuard is active and JWT payload includes roleId.'
      );
      throw new ForbiddenException(
        'Access Denied: User authentication or role information is missing.'
      );
    }

    const userActualPermissions = await this.authService.getPermissionsForRole(
      user.roleId
    );

    const hasAllRequiredPermissions = requiredPermissions.every((permission) =>
      userActualPermissions.includes(permission)
    );

    if (hasAllRequiredPermissions) {
      return true;
    }

    this.logger.warn(
      `Access Denied for user ${user.sub} (Role ID: ${
        user.roleId
      }). Required: [${requiredPermissions.join(
        ', '
      )}], Actual: [${userActualPermissions.join(', ')}]`
    );
    throw new ForbiddenException('You do not have the required permissions.');
  }
}
