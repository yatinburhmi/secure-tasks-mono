import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role, Permission } from '@secure-tasks-mono/database';

@Injectable()
export class RolePermissionsService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>
  ) {}

  /**
   * Retrieves all permission keys associated with a given role ID.
   * @param roleId - The ID of the role.
   * @returns A promise that resolves to an array of permission key strings.
   */
  async getPermissionsForRole(roleId: number): Promise<string[]> {
    if (roleId === undefined || roleId === null) {
      // Handle cases where roleId might not be present (e.g., unauthenticated user if guard isn't strict)
      // Or if a user somehow has no roleId (data integrity issue)
      return [];
    }
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'], // Ensure the 'permissions' relation is loaded
    });

    if (!role || !role.permissions) {
      return []; // Role not found or has no permissions defined
    }

    return role.permissions.map((permission: Permission) => permission.key);
  }
}
