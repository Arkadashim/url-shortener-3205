import { MigrationInterface, QueryRunner } from 'typeorm';

export class Bootstrap1751558265309 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE url (
        shortUrl VARCHAR(50) PRIMARY KEY,
        originalUrl TEXT NOT NULL,
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        clickCount INTEGER DEFAULT 0,
        CONSTRAINT chk_url_short_url CHECK (shortUrl <> ''),
        CONSTRAINT chk_url_original_url CHECK (originalUrl <> '')
      );
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX idx_url_short_url ON url (shortUrl);
      CREATE INDEX idx_url_created_at ON url (createdAt);
    `);

    await queryRunner.query(`
      CREATE TABLE clicks (
        id SERIAL PRIMARY KEY,
        ipAddress VARCHAR(45) NOT NULL,
        clickedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        url_shortUrl VARCHAR(50) NOT NULL,
        FOREIGN KEY (url_shortUrl) REFERENCES url (shortUrl) ON DELETE CASCADE,
        CONSTRAINT chk_clicks_ip_address CHECK (ipAddress <> '')
      );
    `);

    await queryRunner.query(`
      CREATE INDEX idx_clicks_url_id ON clicks (url_shortUrl);
      CREATE INDEX idx_clicks_clicked_at ON clicks (clickedAt);
      CREATE INDEX idx_clicks_ip_address ON clicks (ipAddress);
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_url_click_count()
      RETURNS TRIGGER AS $$
      BEGIN
        UPDATE url
        SET clickCount = clickCount + 1
        WHERE "shortUrl" = NEW.url_shortUrl;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE TRIGGER click_count_trigger
      AFTER INSERT ON clicks
      FOR EACH ROW
      EXECUTE FUNCTION update_url_click_count();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS click_count_trigger ON clicks;`
    );
    await queryRunner.query(`DROP FUNCTION IF EXISTS update_url_click_count;`);

    await queryRunner.query(`DROP INDEX IF EXISTS idx_clicks_url_id;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_clicks_clicked_at;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_clicks_ip_address;`);
    await queryRunner.query(`DROP TABLE IF EXISTS clicks;`);

    await queryRunner.query(`DROP INDEX IF EXISTS idx_url_short_url;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_url_created_at;`);
    await queryRunner.query(`DROP TABLE IF EXISTS url;`);
  }
}
