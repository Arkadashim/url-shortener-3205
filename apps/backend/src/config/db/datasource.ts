import { join } from 'path';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'url_shortener',
  entities: [join(__dirname, 'apps/backend/src/**/*.entity{.ts,.js}')],
  // migrations: [join(__dirname, 'apps/backend/src/migrations/**/*{.ts,.js}')],
  // migrations: ['apps/backend/src/migrations/**/*{.ts,.js}'],
  synchronize: false,
  migrationsRun: true,
  logging: true,
});
