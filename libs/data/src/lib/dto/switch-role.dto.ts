import { IsNotEmpty, IsNumber } from 'class-validator';

/**
 * Data Transfer Object for requesting a user role switch.
 */
export class SwitchRoleDto {
  /**
   * The ID of the new role to switch to.
   * Must be a number and cannot be empty.
   */
  @IsNumber({}, { message: 'New role ID must be a number.' })
  @IsNotEmpty({ message: 'New role ID cannot be empty.' })
  newRoleId!: number;
}
