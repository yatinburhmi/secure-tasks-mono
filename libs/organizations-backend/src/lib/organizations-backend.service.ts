import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '@secure-tasks-mono/database';
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
} from '@secure-tasks-mono/data';

@Injectable()
export class OrganizationsBackendService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>
  ) {}

  /**
   * Creates a new organization.
   * Enforces a 2-level hierarchy: an organization cannot be a sub-organization of another sub-organization.
   * @param createDto - The data to create the organization.
   * @returns A promise that resolves to the newly created organization.
   * @throws NotFoundException if the specified parent organization does not exist.
   * @throws BadRequestException if the specified parent organization is already a sub-organization.
   */
  public async createOrganization(
    createDto: CreateOrganizationDto
  ): Promise<Organization> {
    if (createDto.parentOrganizationId) {
      const parentOrganization = await this.organizationRepository.findOneBy({
        id: createDto.parentOrganizationId,
      });

      if (!parentOrganization) {
        throw new NotFoundException(
          `Parent organization with ID "${createDto.parentOrganizationId}" not found.`
        );
      }

      if (parentOrganization.parentOrganizationId) {
        throw new BadRequestException(
          'Parent organization cannot be a sub-organization itself (2-level hierarchy enforced).'
        );
      }
    }

    // TODO: Consider name uniqueness check if required, e.g., within the same parent or globally.
    // For now, allowing duplicate names.

    const newOrganization = this.organizationRepository.create(createDto);
    return this.organizationRepository.save(newOrganization);
  }

  /**
   * Retrieves all organizations, including their parent and child organizations.
   * @returns A promise that resolves to an array of all organizations.
   */
  public async findAll(): Promise<Organization[]> {
    return this.organizationRepository.find({
      relations: {
        parentOrganization: true,
        childOrganizations: true,
      },
    });
  }

  /**
   * Finds an organization by its ID, including its parent and child organizations.
   * @param id - The ID of the organization to find.
   * @returns A promise that resolves to the organization if found.
   * @throws NotFoundException if the organization with the given ID is not found.
   */
  public async findOneById(id: string): Promise<Organization> {
    const organization = await this.organizationRepository.findOne({
      where: { id },
      relations: {
        parentOrganization: true,
        childOrganizations: true,
      },
    });

    if (!organization) {
      throw new NotFoundException(`Organization with ID "${id}" not found.`);
    }
    return organization;
  }

  /**
   * Updates an existing organization.
   * Enforces a 2-level hierarchy if changing the parent.
   * @param id - The ID of the organization to update.
   * @param updateDto - The data to update the organization with.
   * @returns A promise that resolves to the updated organization.
   * @throws NotFoundException if the organization or new parent organization (if specified) is not found.
   * @throws BadRequestException if hierarchy constraints are violated or self-parenting is attempted.
   */
  public async updateOrganization(
    id: string,
    updateDto: UpdateOrganizationDto
  ): Promise<Organization> {
    const organization = await this.findOneById(id);

    if (updateDto.name !== undefined) {
      organization.name = updateDto.name;
    }

    if (
      Object.prototype.hasOwnProperty.call(updateDto, 'parentOrganizationId')
    ) {
      const newParentId = updateDto.parentOrganizationId;

      if (newParentId === null) {
        organization.parentOrganizationId = null;
        organization.parentOrganization = null;
      } else {
        if (newParentId === id) {
          throw new BadRequestException(
            'Organization cannot be its own parent.'
          );
        }

        const newParentOrganization =
          await this.organizationRepository.findOneBy({ id: newParentId });

        if (!newParentOrganization) {
          throw new NotFoundException(
            `New parent organization with ID "${newParentId}" not found.`
          );
        }

        if (newParentOrganization.parentOrganizationId) {
          throw new BadRequestException(
            'New parent organization cannot be a sub-organization itself (2-level hierarchy enforced).'
          );
        }
        organization.parentOrganizationId = newParentOrganization.id;
      }
    }

    return this.organizationRepository.save(organization);
  }

  /**
   * Removes an organization by its ID.
   * @param id - The ID of the organization to remove.
   * @returns A promise that resolves when the organization is removed.
   * @throws NotFoundException if the organization with the given ID is not found.
   * @throws BadRequestException if the organization has child organizations.
   */
  public async removeOrganization(id: string): Promise<void> {
    const organization = await this.organizationRepository.findOne({
      where: { id },
      relations: { childOrganizations: true },
    });

    if (!organization) {
      throw new NotFoundException(`Organization with ID "${id}" not found.`);
    }

    if (
      organization.childOrganizations &&
      organization.childOrganizations.length > 0
    ) {
      throw new BadRequestException(
        'Cannot delete organization with active sub-organizations. Please reassign or delete them first.'
      );
    }

    await this.organizationRepository.remove(organization);
  }
}
