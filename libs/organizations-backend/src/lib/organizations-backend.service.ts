import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '@secure-tasks-mono/database';

@Injectable()
export class OrganizationsBackendService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>
  ) {}

  /**
   * Finds an organization by its ID.
   * @param id - The ID of the organization to find.
   * @returns A promise that resolves to the organization if found, otherwise null.
   */
  public async findOneById(id: string): Promise<Organization | null> {
    // Assuming the Organization entity has an 'id' property of type string
    return this.organizationRepository.findOneBy({ id });
  }

  /**
   * Retrieves all organizations.
   * @returns A promise that resolves to an array of all organizations.
   */
  public async findAll(): Promise<Organization[]> {
    return this.organizationRepository.find();
  }
}
