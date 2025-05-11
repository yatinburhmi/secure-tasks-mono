import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolePermission, Permission } from '@secure-tasks-mono/database';
import { PasswordService } from './services/password.service';
import { JwtPayload } from './strategies/jwt.strategy';
// Placeholder: Import User type from libs/data or a User service from libs/users-backend later
// import { UserDto } from '@secure-tasks-mono/data';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepository: Repository<RolePermission>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission> // Placeholder: Inject UserService from libs/users-backend later // private readonly usersService: UsersService,
  ) {}

  /**
   * Validates a user based on email and password.
   * NOTE: This is a STUB. Implementation will require UserService.
   * @param email User's email.
   * @param pass Plain text password.
   * @returns The user object if validation is successful, otherwise null.
   */
  async validateUserByPassword(
    email: string,
    pass: string
  ): Promise<any /* UserDto | null */> {
    // const user = await this.usersService.findOneByEmail(email); // Example
    // if (user && await this.passwordService.comparePassword(pass, user.passwordHash)) {
    //   const { passwordHash, ...result } = user; // Don't return hash
    //   return result;
    // }
    // console.warn(
    //   'AuthService.validateUserByPassword is a stub. Needs UsersService integration.',
    //   email, // Prevent unused var error
    //   pass // Prevent unused var error
    // );
    return null;
  }

  /**
   * Logs in a user and returns a JWT access token.
   * NOTE: Assumes user validation has already happened.
   * @param user The user object (e.g., from validateUserByPassword or a social login).
   *             It should contain id, email, roleId, organizationId.
   * @returns An object containing the access token.
   */
  async login(user: {
    id: string;
    email: string;
    roleId: number;
    organizationId: string;
  }): Promise<{ accessToken: string }> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roleId: user.roleId,
      organizationId: user.organizationId,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  // Placeholder for user registration if auth service handles it
  // async registerUser(...) { ... }

  /**
   * Retrieves all permission keys associated with a given role ID.
   * @param roleId The ID of the role.
   * @returns A promise that resolves to an array of permission key strings.
   */
  public async getPermissionsForRole(roleId: number): Promise<string[]> {
    if (!roleId) {
      return [];
    }

    const rolePermissions = await this.rolePermissionRepository.find({
      where: { roleId },
      relations: { permission: true },
    });

    if (!rolePermissions || rolePermissions.length === 0) {
      return [];
    }

    const permissionKeys = rolePermissions
      .map((rp) => rp.permission?.key)
      .filter((key): key is string => !!key);

    return [...new Set(permissionKeys)];
  }
}
