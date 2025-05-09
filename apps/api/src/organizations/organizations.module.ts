import { Module } from '@nestjs/common';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsBackendModule } from '@secure-tasks-mono/organizations-backend';

@Module({
  imports: [OrganizationsBackendModule],
  controllers: [OrganizationsController],
})
export class OrganizationsModule {}
