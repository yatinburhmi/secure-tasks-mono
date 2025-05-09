import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  ParseUUIDPipe,
} from '@nestjs/common';
import { OrganizationsBackendService } from '@secure-tasks-mono/organizations-backend';
import { AuthGuard } from '@nestjs/passport';
import { Organization } from '@secure-tasks-mono/database';
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
} from '@secure-tasks-mono/data';

@Controller('organizations')
@UseGuards(AuthGuard('jwt'))
export class OrganizationsController {
  constructor(
    private readonly organizationsBackendService: OrganizationsBackendService
  ) {}

  /**
   * Creates a new organization.
   * @param createDto - The data for creating the organization.
   * @returns The newly created organization.
   */
  @Post()
  @HttpCode(201)
  public async create(
    @Body() createDto: CreateOrganizationDto
  ): Promise<Organization> {
    return this.organizationsBackendService.createOrganization(createDto);
  }

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
   * @param id - The UUID of the organization to find.
   * @returns A promise that resolves to the organization if found.
   * @throws NotFoundException (via service) if the organization is not found.
   */
  @Get(':id')
  public async findOne(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<Organization> {
    return this.organizationsBackendService.findOneById(id);
  }

  /**
   * Updates an existing organization.
   * @param id - The UUID of the organization to update.
   * @param updateDto - The data to update the organization with.
   * @returns The updated organization.
   */
  @Patch(':id')
  public async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateOrganizationDto
  ): Promise<Organization> {
    return this.organizationsBackendService.updateOrganization(id, updateDto);
  }

  /**
   * Removes an organization by its ID.
   * @param id - The UUID of the organization to remove.
   */
  @Delete(':id')
  @HttpCode(204)
  public async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.organizationsBackendService.removeOrganization(id);
  }
}
