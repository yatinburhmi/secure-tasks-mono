import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { PERMISSIONS_KEY } from '../decorators/require-permissions.decorator';
// Placeholder: Import RoleType from data library if checking roles here
// import { RoleType } from '@secure-tasks-mono/data';
// Placeholder: Import JwtPayload type
// import { JwtPayload } from '../strategies/jwt.strategy';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    // 1. Get the required permissions from the decorator
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [
        context.getHandler(), // Method decorator
        context.getClass(), // Class decorator
      ]
    );

    // If no permissions are required, allow access
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    // 2. Get the user object from the request (attached by JwtStrategy)
    const request = context.switchToHttp().getRequest();
    const user = request.user as any; // Cast to 'any' for now, use JwtPayload later

    // If user is not attached (e.g., route wasn't protected by AuthGuard), deny access
    if (!user) {
      console.error(
        'PermissionsGuard used without AuthGuard? User object not found.'
      );
      throw new ForbiddenException('Access Denied');
    }

    // 3. Placeholder for actual permission checking logic
    // This is where you would:
    //    - Get the user's actual permissions (e.g., based on user.roleId, possibly fetching from DB via a service)
    //    - Check if the user's permissions include ALL requiredPermissions
    console.warn(
      'PermissionsGuard logic is a STUB. Needs implementation to check user permissions against required permissions.',
      { required: requiredPermissions, userId: user?.sub }
    );

    // For now, deny access if permissions are required but logic isn't implemented
    // In a real implementation, this would return true/false based on the check
    // return requiredPermissions.every((permission) => user.permissions?.includes(permission)); // Example structure

    // Temporarily allow access during development until logic is added
    // REMOVE THIS FOR PRODUCTION or when logic is implemented
    console.log('Temporarily allowing access in PermissionsGuard stub');
    return true;

    // Or uncomment to deny by default until implemented:
    // throw new ForbiddenException('You do not have the required permissions.');
  }
}
