import {
  Controller,
  Get,
  Param,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { OrganizationsBackendService } from '@secure-tasks-mono/organizations-backend';
import { AuthGuard } from '@nestjs/passport'; // Standard JWT AuthGuard
import { Organization } from '@secure-tasks-mono/database';

@Controller('organizations')
@UseGuards(AuthGuard('jwt')) // Apply AuthGuard to all routes in this controller
export class OrganizationsController {
  constructor(
    private readonly organizationsBackendService: OrganizationsBackendService
  ) {}

  /**
   * Retrieves all organizations.
   * @returns A promise that resolves to an array of all organizations.
   */
  @Get()
  public async findAll(): Promise<Organization[]> {
    return this.organizationsBackendService.findAll();
  }

  /**
   * Finds an organization by its ID.
   * @param id - The ID of the organization to find.
   * @returns A promise that resolves to the organization if found.
   * @throws NotFoundException if the organization with the given ID is not found.
   */
  @Get(':id')
  public async findOne(@Param('id') id: string): Promise<Organization> {
    const organization: Organization | null =
      await this.organizationsBackendService.findOneById(id);
    if (!organization) {
      throw new NotFoundException(`Organization with ID "${id}" not found`);
    }
    return organization;
  }
}
