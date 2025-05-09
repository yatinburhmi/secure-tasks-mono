import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppDataSourceOptions } from '@secure-tasks-mono/database';
import { AuthModule } from '@secure-tasks-mono/auth';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../users/users.module';
import { OrganizationsModule } from '../organizations/organizations.module';

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
    UsersModule,
    OrganizationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
