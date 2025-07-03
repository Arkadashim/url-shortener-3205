import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameToCamelCase21751572344565 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Rename columns in url table
    await queryRunner.query(
      `ALTER TABLE url RENAME COLUMN shorturl TO "shortUrl";`
    );
    await queryRunner.query(
      `ALTER TABLE url RENAME COLUMN originalurl TO "originalUrl";`
    );

    // Rename index in url table
    await queryRunner.query(`DROP INDEX IF EXISTS idx_url_short_url;`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "idx_url_shortUrl" ON url ("shortUrl");`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Rename index back in url table
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_url_shortUrl";`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX idx_url_short_url ON url (shorturl);`
    );

    // Rename columns back in url table
    await queryRunner.query(
      `ALTER TABLE url RENAME COLUMN "originalUrl" TO originalurl;`
    );
    await queryRunner.query(
      `ALTER TABLE url RENAME COLUMN "shortUrl" TO shorturl;`
    );
  }
}
