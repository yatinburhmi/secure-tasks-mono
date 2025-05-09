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
} from '@nestjs/common';
import { UsersBackendService } from '@secure-tasks-mono/users-backend';
import { AuthGuard } from '@nestjs/passport'; // Standard JWT AuthGuard
import { User } from '@secure-tasks-mono/database';
import { CreateUserDto, UpdateUserDto } from '@secure-tasks-mono/data'; // Import DTOs
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
   * Retrieves all users. (Protected)
   * @returns A promise that resolves to an array of all users.
   */
  @Get()
  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @RequirePermissions(PERM_USER_READ)
  public async findAll(): Promise<User[]> {
    return this.usersBackendService.findAll();
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
