import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  Query,
  ParseUUIDPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UsersBackendService } from '@secure-tasks-mono/users-backend';
import { AuthGuard } from '@nestjs/passport'; // Standard JWT AuthGuard
import { User } from '@secure-tasks-mono/database';
import { CreateUserDto, UpdateUserDto, UserDto } from '@secure-tasks-mono/data'; // Import DTOs, Added UserDto
import {
  AuthService,
  PermissionsGuard,
  RequirePermissions,
  PERM_USER_READ,
} from '@secure-tasks-mono/auth'; // Added Permissions imports

// Define a response DTO for user creation, if desired, for clarity
export class UserCreationResponseDto {
  user!: Omit<User, 'passwordHash'>;
  accessToken!: string;
}

@Controller('users')
// No controller-level @UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(
    private readonly usersBackendService: UsersBackendService,
    private readonly authService: AuthService // Inject AuthService
  ) {}

  /**
   * Creates a new user. (Publicly accessible for registration)
   * @param createUserDto - Data for creating the user.
   * @returns A promise that resolves to the created user.
   */
  @Post()
  public async createUser(
    @Body() createUserDto: CreateUserDto
  ): Promise<UserCreationResponseDto> {
    // Updated return type
    const user = await this.usersBackendService.createUser(createUserDto);

    const { passwordHash, ...userResult } = user; // Exclude passwordHash

    // AuthService.login expects id, email, roleId, organizationId
    const tokenPayload = {
      id: user.id,
      email: user.email,
      roleId: user.roleId,
      organizationId: user.organizationId,
    };
    const { accessToken } = await this.authService.login(tokenPayload);

    return {
      user: userResult as User, // Cast because Omit isn't fully understood by TS here for the specific type User
      accessToken,
    };
  }

  /**
   * Retrieves users. If organizationId is provided, retrieves users for that organization.
   * Otherwise, retrieves all users (subject to permissions).
   * @param organizationId - Optional ID of the organization to filter users by.
   * @returns A promise that resolves to an array of users.
   */
  @Get()
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @RequirePermissions(PERM_USER_READ) // This permission might need to be more granular for org-specific fetching
  public async findUsers(
    @Query('organizationId', new ParseUUIDPipe({ optional: true }))
    organizationId?: string
  ): Promise<UserDto[]> {
    let users: User[];
    if (organizationId) {
      // TODO: Add authorization check: Does the requesting user have permission to view users for this specific organizationId?
      // This might involve getting the current user from the request (e.g., @Req() req)
      // and checking their organizationId or role.
      try {
        users = await this.usersBackendService.findAllByOrganization(
          organizationId
        );
      } catch (error) {
        // Log the error and rethrow or throw a more specific HTTP exception
        console.error(
          `Error fetching users for organization ${organizationId}:`,
          error
        );
        if (error instanceof HttpException) throw error;
        throw new HttpException(
          'Failed to fetch users for the organization.',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    } else {
      // This path (findAll) should ideally be restricted to super admins or system roles.
      // PERM_USER_READ might be too broad if it allows any authenticated user to list all users.
      users = await this.usersBackendService.findAll();
    }

    // Map User entities to UserDto to exclude sensitive fields like passwordHash
    return users.map(
      (user) =>
        ({
          id: user.id,
          name: user.name,
          email: user.email,
          roleId: user.roleId,
          organizationId: user.organizationId,
          isActive: user.isActive,
          createdAt:
            user.createdAt instanceof Date
              ? user.createdAt.toISOString()
              : String(user.createdAt),
          updatedAt:
            user.updatedAt instanceof Date
              ? user.updatedAt.toISOString()
              : String(user.updatedAt),
          // Any other fields from UserDto that are safe to expose
        } as unknown as UserDto)
    ); // Double cast as suggested by the linter error message
  }

  /**
   * Finds a user by their ID. (Protected)
   * @param id - The ID of the user to find.
   * @returns A promise that resolves to the user if found.
   * @throws NotFoundException if the user with the given ID is not found (handled by service).
   */
  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  public async findOne(@Param('id') id: string): Promise<User> {
    // Service now throws NotFoundException, so no need for the null check here.
    return this.usersBackendService.findOneById(id);
  }

  /**
   * Updates an existing user. (Protected)
   * @param id - The ID of the user to update.
   * @param updateUserDto - Data for updating the user.
   * @returns A promise that resolves to the updated user.
   */
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  public async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User> {
    return this.usersBackendService.updateUser(id, updateUserDto);
  }

  /**
   * Deletes a user by their ID. (Protected)
   * @param id - The ID of the user to delete.
   */
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(204) // Standard for successful DELETE with no content to return
  public async removeUser(@Param('id') id: string): Promise<void> {
    return this.usersBackendService.removeUser(id);
  }
}
