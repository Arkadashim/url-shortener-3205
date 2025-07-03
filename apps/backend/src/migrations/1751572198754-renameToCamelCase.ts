import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameToCamelCase1751572198754 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Rename columns in url table
    await queryRunner.query(
      `ALTER TABLE url RENAME COLUMN createdat TO "createdAt";`
    );
    await queryRunner.query(
      `ALTER TABLE url RENAME COLUMN clickcount TO "clickCount";`
    );
    await queryRunner.query(
      `ALTER TABLE url RENAME COLUMN expiresat TO "expiresAt";`
    );

    // Rename indexes in url table
    await queryRunner.query(`DROP INDEX IF EXISTS idx_url_created_at;`);
    await queryRunner.query(
      `CREATE INDEX "idx_url_createdAt" ON url ("createdAt");`
    );

    // Rename columns in clicks table
    await queryRunner.query(
      `ALTER TABLE clicks RENAME COLUMN ipaddress TO "ipAddress";`
    );
    await queryRunner.query(
      `ALTER TABLE clicks RENAME COLUMN clickedat TO "clickedAt";`
    );
    await queryRunner.query(
      `ALTER TABLE clicks RENAME COLUMN url_shorturl TO "url_shortUrl";`
    );

    // Rename indexes in clicks table
    await queryRunner.query(`DROP INDEX IF EXISTS idx_clicks_url_id;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_clicks_clicked_at;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_clicks_ip_address;`);
    await queryRunner.query(
      `CREATE INDEX "idx_clicks_url_shortUrl" ON clicks ("url_shortUrl");`
    );
    await queryRunner.query(
      `CREATE INDEX "idx_clicks_clickedAt" ON clicks ("clickedAt");`
    );
    await queryRunner.query(
      `CREATE INDEX "idx_clicks_ipAddress" ON clicks ("ipAddress");`
    );

    // Update trigger function to use renamed column
    await queryRunner.query(`
         CREATE OR REPLACE FUNCTION update_url_click_count()
         RETURNS TRIGGER AS $$
         BEGIN
           UPDATE url
           SET "clickCount" = "clickCount" + 1
           WHERE "shortUrl" = NEW."url_shortUrl";
           RETURN NEW;
         END;
         $$ LANGUAGE plpgsql;
       `);

    // Recreate trigger to ensure it uses updated function
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS click_count_trigger ON clicks;`
    );
    await queryRunner.query(`
         CREATE TRIGGER click_count_trigger
         AFTER INSERT ON clicks
         FOR EACH ROW
         EXECUTE FUNCTION update_url_click_count();
       `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop trigger and function
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS click_count_trigger ON clicks;`
    );
    await queryRunner.query(`DROP FUNCTION IF EXISTS update_url_click_count;`);

    // Rename indexes back in clicks table
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_clicks_url_shortUrl";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_clicks_clickedAt";`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_clicks_ipAddress";`);
    await queryRunner.query(
      `CREATE INDEX idx_clicks_url_id ON clicks (url_shorturl);`
    );
    await queryRunner.query(
      `CREATE INDEX idx_clicks_clicked_at ON clicks (clickedat);`
    );
    await queryRunner.query(
      `CREATE INDEX idx_clicks_ip_address ON clicks (ipaddress);`
    );

    // Rename columns back in clicks table
    await queryRunner.query(
      `ALTER TABLE clicks RENAME COLUMN "url_shortUrl" TO url_shorturl;`
    );
    await queryRunner.query(
      `ALTER TABLE clicks RENAME COLUMN "clickedAt" TO clickedat;`
    );
    await queryRunner.query(
      `ALTER TABLE clicks RENAME COLUMN "ipAddress" TO ipaddress;`
    );

    // Rename indexes back in url table
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_url_createdAt";`);
    await queryRunner.query(
      `CREATE INDEX idx_url_created_at ON url (createdat);`
    );

    // Rename columns back in url table
    await queryRunner.query(
      `ALTER TABLE url RENAME COLUMN "expiresAt" TO expiresat;`
    );
    await queryRunner.query(
      `ALTER TABLE url RENAME COLUMN "clickCount" TO clickcount;`
    );
    await queryRunner.query(
      `ALTER TABLE url RENAME COLUMN "createdAt" TO createdat;`
    );

    // Recreate original trigger function
    await queryRunner.query(`
         CREATE OR REPLACE FUNCTION update_url_click_count()
         RETURNS TRIGGER AS $$
         BEGIN
           UPDATE url
           SET clickcount = clickcount + 1
           WHERE "shortUrl" = NEW.url_shorturl;
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
}
