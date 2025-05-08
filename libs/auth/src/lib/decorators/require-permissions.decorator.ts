import { SetMetadata } from '@nestjs/common';

// Key to store permission metadata
export const PERMISSIONS_KEY = 'permissions';

/**
 * Custom decorator to attach required permissions to a route handler or controller.
 * Usage: @RequirePermissions('task:create', 'task:update')
 *
 * @param permissions One or more permission keys (strings) required.
 */
export const RequirePermissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
