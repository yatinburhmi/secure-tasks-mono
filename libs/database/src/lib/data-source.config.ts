import 'reflect-metadata'; // Required for TypeORM
import { DataSource, DataSourceOptions } from 'typeorm';
import * as path from 'path';
import { Organization } from './entities/index'; // REVERTED: Back to barrel file import
import { User } from './entities/index';
import { Role } from './entities/index';
import { Permission } from './entities/index';
import { Task } from './entities/index';
import { RolePermission } from './entities/index';
import { AuditLogEntity } from './entities/index';

// Helper function to get base options common to both SQLite and PostgreSQL
const getBaseOptions = (): Partial<DataSourceOptions> => ({
  entities: [
    Organization,
    User,
    Role,
    Permission,
    Task,
    RolePermission,
    AuditLogEntity,
  ],
  // The path should correctly point from the compiled output (e.g., dist/libs/database/src/lib/data-source.js)
  // back to the source migrations directory (e.g., libs/database/src/migrations).
  migrations: [path.join(__dirname, '../migrations/*{.ts,.js}')], // Corrected path to libs/database/src/migrations, // Corrected path
  migrationsTableName: 'migrations_history',
  synchronize: false, // Never use TRUE in production! Crucial for migrations.
  logging: process.env['NODE_ENV'] === 'development', // Log SQL only in development
});

// // Configuration for SQLite (Default for Development/Testing if USE_POSTGRES is not true)
// const sqliteDataSourceOptions = {
//   ...getBaseOptions(),
//   type: 'sqlite' as const,
//   database: process.env['SQLITE_DB_PATH'] || './secure-tasks-dev.sqlite', // From .env or default
//   // SQLite specific options can be added here if needed
// };

// Configuration for PostgreSQL (Used if USE_POSTGRES=true or NODE_ENV=production)
const postgresDataSourceOptions = {
  ...getBaseOptions(),
  type: 'postgres' as const,
  host: process.env['DB_HOST'] || 'localhost',
  port: parseInt(process.env['DB_PORT'] || '5432', 10),
  username: process.env['DB_USERNAME'] || 'postgres',
  password: process.env['DB_PASSWORD'] || 'password',
  database: process.env['DB_DATABASE'] || 'secure_tasks_db',
  ssl: process.env['DB_SSL'] === 'true' ? { rejectUnauthorized: false } : false,
  // PostgreSQL specific options can be added here if needed
};

// Determine which DataSource configuration to use
// const usePostgres =
//   process.env['NODE_ENV'] === 'production' ||
//   process.env['USE_POSTGRES'] === 'true';

// export const AppDataSourceOptions = usePostgres
//   ? postgresDataSourceOptions
//   : sqliteDataSourceOptions;

export const AppDataSourceOptions = postgresDataSourceOptions;
// Export a new DataSource instance
export const AppDataSource = new DataSource(
  AppDataSourceOptions as DataSourceOptions
);
