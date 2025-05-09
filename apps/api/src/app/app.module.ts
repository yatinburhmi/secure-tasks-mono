import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppDataSourceOptions } from '@secure-tasks-mono/database';
import { AuthModule } from '@secure-tasks-mono/auth';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersBackendModule } from '@secure-tasks-mono/users-backend';
import { UsersController } from '../users/users.controller';
import { OrganizationsBackendModule } from '@secure-tasks-mono/organizations-backend';
import { OrganizationsController } from '../organizations/organizations.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: (): TypeOrmModuleOptions => {
        const options: TypeOrmModuleOptions = {
          ...(AppDataSourceOptions as any),
          autoLoadEntities: true,
        };
        return options;
      },
      inject: [],
    }),
    AuthModule,
    UsersBackendModule,
    OrganizationsBackendModule,
  ],
  controllers: [AppController, UsersController, OrganizationsController],
  providers: [AppService],
})
export class AppModule {}
