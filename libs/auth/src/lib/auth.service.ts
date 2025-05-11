import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, RolePermission, Permission } from '@secure-tasks-mono/database';
import { PasswordService } from '@secure-tasks-mono/security';
import { JwtPayload } from './strategies/jwt.strategy';
import { UsersBackendService } from '@secure-tasks-mono/users-backend';
// Placeholder: Import User type from libs/data or a User service from libs/users-backend later
// import { UserDto } from '@secure-tasks-mono/data';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
    private readonly usersBackendService: UsersBackendService,
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepository: Repository<RolePermission>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission> // Placeholder: Inject UserService from libs/users-backend later // private readonly usersService: UsersService,
  ) {}

  /**
   * Validates a user based on email and password.
   * @param email User's email.
   * @param pass Plain text password.
   * @returns The user object (without passwordHash) if validation is successful, otherwise null.
   */
  async validateUserByPassword(
    email: string,
    pass: string
  ): Promise<Omit<User, 'passwordHash'> | null> {
    console.log(
      `[AuthService] Validating user by password for email: ${email}`
    );
    const user =
      await this.usersBackendService.findOneByEmailIncludingPasswordHash(email);

    if (!user) {
      console.log(`[AuthService] User not found for email: ${email}`);
      return null;
    }
    console.log(
      `[AuthService] User found: ${user.email}, ID: ${user.id}. Checking passwordHash.`
    );

    if (!user.passwordHash) {
      console.error(
        `[AuthService] CRITICAL: User ${user.email} (ID: ${user.id}) has no passwordHash in the database!`
      );
      return null; // Or throw an internal server error, as this is a data integrity issue
    }
    console.log(
      `[AuthService] User ${user.email} has a password hash. Comparing provided password.`
    );
    // For debugging, DO NOT log plain text passwords or hashes in production
    // console.log(`[AuthService] Provided pass: ${pass}`);
    // console.log(`[AuthService] Stored hash: ${user.passwordHash}`);

    const passwordsMatch = await this.passwordService.comparePassword(
      pass,
      user.passwordHash
    );

    if (passwordsMatch) {
      console.log(`[AuthService] Passwords match for user: ${user.email}`);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash, ...result } = user;
      return result;
    }

    console.log(`[AuthService] Passwords DO NOT match for user: ${user.email}`);
    return null;
  }

  /**
   * Logs in a user and returns a JWT access token.
   * NOTE: Assumes user validation has already happened and a valid user object (or its essential parts for JWT) is provided.
   * @param userPayload The essential parts of the user object for the JWT payload.
   *                    It should contain id, email, roleId, organizationId.
   * @returns An object containing the access token.
   */
  async login(userPayload: {
    id: string;
    email: string;
    roleId: number;
    organizationId: string;
  }): Promise<{ accessToken: string }> {
    const jwtTokenPayload: JwtPayload = {
      sub: userPayload.id,
      email: userPayload.email,
      roleId: userPayload.roleId,
      organizationId: userPayload.organizationId,
    };
    return {
      accessToken: this.jwtService.sign(jwtTokenPayload),
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
