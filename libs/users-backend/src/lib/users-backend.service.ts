import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@secure-tasks-mono/database'; // Assuming User entity is exported
import { CreateUserDto, UpdateUserDto } from '@secure-tasks-mono/data';
import { PasswordService } from '@secure-tasks-mono/auth';

@Injectable()
export class UsersBackendService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly passwordService: PasswordService
  ) {}

  /**
   * Creates a new user after hashing their password.
   * @param createUserDto - Data for creating the user.
   * @returns A promise that resolves to the created user.
   * @throws ConflictException if a user with the same email already exists.
   */
  public async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, name, roleId, organizationId } = createUserDto;

    const existingUser = await this.userRepository.findOneBy({ email });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await this.passwordService.hashPassword(password);

    const newUser = this.userRepository.create({
      email,
      name,
      passwordHash: hashedPassword,
      roleId,
      organizationId,
      isActive: true, // Default to active
    });

    return this.userRepository.save(newUser);
  }

  /**
   * Finds a user by their ID.
   * @param id - The ID of the user to find.
   * @returns A promise that resolves to the user if found.
   * @throws NotFoundException if the user is not found.
   */
  public async findOneById(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }

  /**
   * Retrieves all users.
   * @returns A promise that resolves to an array of all users.
   */
  public async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  /**
   * Updates an existing user.
   * @param id - The ID of the user to update.
   * @param updateUserDto - Data for updating the user.
   * @returns A promise that resolves to the updated user.
   * @throws NotFoundException if the user with the given ID is not found.
   */
  public async updateUser(
    id: string,
    updateUserDto: UpdateUserDto
  ): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    const { email, password, name, roleId, organizationId } = updateUserDto;

    if (email) {
      const existingUserWithNewEmail = await this.userRepository.findOne({
        where: { email },
      });
      if (existingUserWithNewEmail && existingUserWithNewEmail.id !== id) {
        throw new ConflictException(
          'Another user with this email already exists'
        );
      }
      user.email = email;
    }
    if (roleId !== undefined) {
      user.roleId = roleId;
    }
    if (organizationId) {
      user.organizationId = organizationId;
    }

    if (name !== undefined) {
      user.name = name;
    }

    if (password) {
      user.passwordHash = await this.passwordService.hashPassword(password);
    }

    return this.userRepository.save(user);
  }

  /**
   * Removes a user by their ID.
   * @param id - The ID of the user to remove.
   * @returns A promise that resolves when the user is removed.
   * @throws NotFoundException if the user with the given ID is not found.
   */
  public async removeUser(id: string): Promise<void> {
    const user = await this.findOneById(id);
    await this.userRepository.remove(user);
  }
}
