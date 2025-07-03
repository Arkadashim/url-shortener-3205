import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'url_shortener',
  entities: ['apps/backend/dist/src/app/entities/*.js'],
  migrations: ['apps/backend/dist/src/migrations/*.js'],
  synchronize: false,
  migrationsRun: true,
  logging: true,
});
