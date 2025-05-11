import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService as LibAuthService } from '@secure-tasks-mono/auth'; // Service from libs/auth
import { LoginUserDto } from '@secure-tasks-mono/data';

@Controller('auth')
export class AuthController {
  constructor(private readonly libAuthService: LibAuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginUserDto
  ): Promise<{ accessToken: string }> {
    console.log('[AuthController] Login attempt for:', loginDto.email);

    const validatedUser = await this.libAuthService.validateUserByPassword(
      loginDto.email,
      loginDto.password
    );

    if (!validatedUser) {
      console.log(
        '[AuthController] User validation failed for:',
        loginDto.email
      );
      throw new UnauthorizedException('Invalid credentials. Please try again.');
    }

    console.log(
      '[AuthController] User validated successfully:',
      validatedUser.email
    );
    // The validatedUser object should contain id, email, roleId, organizationId
    // from the Omit<User, 'passwordHash'> type returned by validateUserByPassword.
    if (
      !validatedUser.id ||
      !validatedUser.email ||
      validatedUser.roleId === undefined || // Check for undefined specifically if roleId can be 0
      !validatedUser.organizationId
    ) {
      console.error(
        '[AuthController] Validated user object is missing required properties for JWT payload:',
        validatedUser
      );
      // This case indicates an issue with the data returned by validateUserByPassword or the User entity itself.
      throw new UnauthorizedException(
        'User data integrity issue during login process.'
      );
    }

    return this.libAuthService.login({
      id: validatedUser.id,
      email: validatedUser.email,
      roleId: validatedUser.roleId,
      organizationId: validatedUser.organizationId,
    });
  }
}
