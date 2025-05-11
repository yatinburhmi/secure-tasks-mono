import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from '@secure-tasks-mono/auth';
import { LoginUserDto } from '@secure-tasks-mono/data';
// import { Public } from '@secure-tasks-mono/auth'; // Assuming you have a Public decorator

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
}
