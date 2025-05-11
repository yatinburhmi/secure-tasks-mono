import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  Patch,
} from '@nestjs/common';
import { AuthService } from '@secure-tasks-mono/auth';
import { LoginUserDto, SwitchRoleDto } from '@secure-tasks-mono/data';
import { UsersBackendService } from '@secure-tasks-mono/users-backend';
import { AuthGuard } from '@nestjs/passport';
// import { Public } from '@secure-tasks-mono/auth'; // Assuming you have a Public decorator

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersBackendService: UsersBackendService
  ) {}

  /**
   * Handles user login.
   * Validates credentials and returns a JWT access token upon success.
   * @param loginUserDto - Credentials for login (email and password).
   * @returns An object containing the access token.
   * @throws UnauthorizedException if credentials are invalid.
   */
  // @Public() // Mark this route as public if you have a global JWT guard - Removed for now
  @Post('login')
  @HttpCode(HttpStatus.OK) // Explicitly set 200 OK for successful login
  async login(
    @Body() loginUserDto: LoginUserDto
  ): Promise<{ accessToken: string }> {
    console.log('[AuthController] Login attempt for:', loginUserDto.email);

    const validatedUser = await this.authService.validateUserByPassword(
      loginUserDto.email,
      loginUserDto.password
    );

    if (!validatedUser) {
      console.log(
        '[AuthController] User validation failed for:',
        loginUserDto.email
      );
      throw new UnauthorizedException('Invalid credentials. Please try again.');
    }

    console.log(
      '[AuthController] User validated successfully:',
      validatedUser.email
    );
    // The validatedUser object should contain id, email, roleId, organizationId
    // Ensure your User entity and the Omit<User, 'passwordHash'> type include these.
    if (
      !validatedUser.id ||
      !validatedUser.email ||
      validatedUser.roleId === undefined ||
      !validatedUser.organizationId
    ) {
      console.error(
        '[AuthController] Validated user object is missing required properties for JWT payload:',
        validatedUser
      );
      throw new UnauthorizedException(
        'User data incomplete for login process.'
      ); // Or a 500 error
    }

    return this.authService.login({
      id: validatedUser.id,
      email: validatedUser.email,
      roleId: validatedUser.roleId,
      organizationId: validatedUser.organizationId,
    });
  }

  /**
   * Handles user role switching.
   * Updates the user's role and returns a new JWT access token.
   * @param switchRoleDto - Contains the newRoleId.
   * @param req - The request object, containing user from JWT payload.
   * @returns An object containing the new access token.
   * @throws UnauthorizedException if the user is not found or data is incomplete.
   */
  @Post('switch-role') // Or @Patch as per preference
  @UseGuards(AuthGuard('jwt')) // Protect this endpoint
  @HttpCode(HttpStatus.OK)
  async switchRole(
    @Body() switchRoleDto: SwitchRoleDto,
    @Request() req: any // Access the request object to get req.user (from JWT)
  ): Promise<{ accessToken: string }> {
    const userId = req.user?.sub; // 'sub' is typical for user ID in JWT payload
    const currentEmail = req.user?.email;

    if (!userId) {
      console.error(
        '[AuthController] switchRole: User ID not found in JWT payload.'
      );
      throw new UnauthorizedException(
        'Invalid token or user identifier missing.'
      );
    }
    console.log(
      `[AuthController] switchRole attempt for user ID: ${userId} to new role ID: ${switchRoleDto.newRoleId}`
    );

    // 1. Update user's role in the database
    // The updateUser method should ideally return the updated user entity
    const updatedUser = await this.usersBackendService.updateUser(userId, {
      roleId: switchRoleDto.newRoleId,
      // Provide other fields as undefined or ensure updateUser handles partial updates gracefully
      email: undefined, // Or currentEmail if you intend to re-validate/pass it
      name: undefined,
      password: undefined,
      organizationId: undefined, // Or req.user?.organizationId if it should be asserted
    });

    if (!updatedUser) {
      console.error(
        `[AuthController] switchRole: Failed to update user ID: ${userId}. User not found or update failed.`
      );
      throw new UnauthorizedException('Failed to update user role.');
    }

    // 2. Ensure all necessary fields are present for the new JWT payload
    if (
      !updatedUser.id ||
      !updatedUser.email ||
      updatedUser.roleId === undefined ||
      !updatedUser.organizationId
    ) {
      console.error(
        '[AuthController] switchRole: Updated user object is missing required properties for JWT payload:',
        updatedUser
      );
      throw new UnauthorizedException(
        'Updated user data integrity issue during role switch.'
      );
    }
    console.log(
      `[AuthController] switchRole: User ID: ${userId} role updated to ${updatedUser.roleId}. Generating new token.`
    );

    // 3. Generate new token with updated claims
    return this.authService.login({
      id: updatedUser.id,
      email: updatedUser.email,
      roleId: updatedUser.roleId,
      organizationId: updatedUser.organizationId,
    });
  }
}
