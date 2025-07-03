import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddExpireAt1751570984863 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE url
      ADD COLUMN expiresAt TIMESTAMP NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE url
      DROP COLUMN expiresAt;
   `);
  }
}
