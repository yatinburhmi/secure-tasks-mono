import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@secure-tasks-mono/database'; // Assuming User entity is exported
import { CreateUserDto, UpdateUserDto } from '@secure-tasks-mono/data';
import { PasswordService } from '@secure-tasks-mono/security';

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
   * Finds a user by their email, ensuring the password hash is included.
   * This method is specifically for authentication purposes.
   * @param email - The email of the user to find.
   * @returns A promise that resolves to the user if found (with password hash), otherwise null.
   */
  public async findOneByEmailIncludingPasswordHash(
    email: string
  ): Promise<User | null> {
    // Standard findOneBy should include passwordHash as it's not marked with { select: false }
    // If issues arise, use queryBuilder with .addSelect('user.passwordHash')
    const user = await this.userRepository.findOneBy({ email });
    return user; // Returns user or null if not found
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
   * Retrieves all users belonging to a specific organization.
   * @param organizationId - The ID of the organization.
   * @returns A promise that resolves to an array of users in that organization.
   * @throws Error if organizationId is not provided.
   */
  public async findAllByOrganization(organizationId: string): Promise<User[]> {
    if (!organizationId) {
      // Consider throwing a BadRequestException from '@nestjs/common' if this service is directly hit by controller
      // For now, simple error for clarity if used internally and ID is expected.
      throw new Error(
        'Organization ID must be provided when calling findAllByOrganization.'
      );
    }
    return this.userRepository.find({
      where: { organizationId },
      // Example: If you need to ensure certain fields are not returned,
      // you might use `select` option if not handled by DTO mapping at controller level.
      // select: ['id', 'name', 'email', 'roleId', 'organizationId', 'isActive', 'createdAt', 'updatedAt'],
    });
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

    const {
      email: newEmail,
      password,
      name,
      roleId,
      organizationId,
    } = updateUserDto; // Renamed email to newEmail to avoid conflict

    if (newEmail) {
      const existingUserWithNewEmail = await this.userRepository.findOne({
        where: { email: newEmail }, // Use newEmail here
      });
      if (existingUserWithNewEmail && existingUserWithNewEmail.id !== id) {
        throw new ConflictException(
          'Another user with this email already exists'
        );
      }
      user.email = newEmail;
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
