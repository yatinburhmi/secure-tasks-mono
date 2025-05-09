import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@secure-tasks-mono/database'; // Assuming User entity is exported

@Injectable()
export class UsersBackendService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  /**
   * Finds a user by their ID.
   * @param id - The ID of the user to find.
   * @returns A promise that resolves to the user if found, otherwise null.
   */
  public async findOneById(id: string): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  /**
   * Retrieves all users.
   * @returns A promise that resolves to an array of all users.
   */
  public async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
}
