import {
  Controller,
  Get,
  Param,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { UsersBackendService } from '@secure-tasks-mono/users-backend';
import { AuthGuard } from '@nestjs/passport'; // Standard JWT AuthGuard
import { User } from '@secure-tasks-mono/database';

@Controller('users')
@UseGuards(AuthGuard('jwt')) // Apply AuthGuard to all routes in this controller
export class UsersController {
  constructor(private readonly usersBackendService: UsersBackendService) {}

  /**
   * Retrieves all users.
   * @returns A promise that resolves to an array of all users.
   */
  @Get()
  public async findAll(): Promise<User[]> {
    return this.usersBackendService.findAll();
  }

  /**
   * Finds a user by their ID.
   * @param id - The ID of the user to find.
   * @returns A promise that resolves to the user if found.
   * @throws NotFoundException if the user with the given ID is not found.
   */
  @Get(':id')
  public async findOne(@Param('id') id: string): Promise<User> {
    const user: User | null = await this.usersBackendService.findOneById(id);
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }
}
