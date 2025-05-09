import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppDataSourceOptions } from '@secure-tasks-mono/database';
import { AuthModule } from '@secure-tasks-mono/auth';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available globally
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Ensure ConfigModule is imported if ConfigService is used here
      useFactory: (): TypeOrmModuleOptions => ({
        ...(AppDataSourceOptions as any), // Cast to any to resolve immediate type issues, then spread
        autoLoadEntities: true, // Add NestJS specific option for convenience
      }),
      // inject: [ConfigService], // Not needed if useFactory doesn't directly depend on ConfigService
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
