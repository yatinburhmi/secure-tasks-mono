import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

// This payload structure should match what your AuthService puts into the JWT
export interface JwtPayload {
  sub: string; // Standard JWT subject claim (usually userId)
  email: string;
  roleId: number; // Or string, depending on your Role entity PK
  organizationId: string;
  // Add any other fields you want in the JWT payload and subsequently in `request.user`
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      // This error will prevent the application from starting if JWT_SECRET is not set,
      // which is good practice for critical configuration.
      throw new InternalServerErrorException(
        'JWT_SECRET not found in environment variables.'
      );
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret, // Now guaranteed to be a string
    });
  }

  /**
   * This method is called after the JWT is successfully verified (signature and expiration).
   * The return value of this method will be attached to the `request.user` object.
   * @param payload The decoded JWT payload.
   */
  async validate(payload: JwtPayload): Promise<JwtPayload> {
    // Here, you could do additional validation if needed, e.g.,
    // check if the user still exists in the DB or is not blacklisted.
    // For now, we'll assume if the token is valid, the payload is good.
    // Ensure the payload contains essential identifiers.
    if (
      !payload.sub ||
      !payload.email ||
      !payload.roleId ||
      !payload.organizationId
    ) {
      throw new UnauthorizedException('Invalid token claims');
    }
    return payload; // This becomes request.user
  }
}
