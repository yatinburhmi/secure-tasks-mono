import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from '@secure-tasks-mono/database';
import { OrganizationsBackendService } from './organizations-backend.service';

@Module({
  imports: [TypeOrmModule.forFeature([Organization])],
  providers: [OrganizationsBackendService],
  exports: [OrganizationsBackendService],
})
export class OrganizationsBackendModule {}
