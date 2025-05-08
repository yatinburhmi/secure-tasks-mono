import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  private readonly saltRounds = 10; // Or make configurable via ConfigService

  /**
   * Hashes a plain text password.
   * @param plainTextPassword The password to hash.
   * @returns A promise that resolves to the hashed password.
   */
  async hashPassword(plainTextPassword: string): Promise<string> {
    return bcrypt.hash(plainTextPassword, this.saltRounds);
  }

  /**
   * Compares a plain text password with a stored hash.
   * @param plainTextPassword The plain text password to check.
   * @param hashedPassword The stored hash to compare against.
   * @returns A promise that resolves to true if the passwords match, false otherwise.
   */
  async comparePassword(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }
}
