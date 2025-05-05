import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1746429752612 implements MigrationInterface {
    name = 'BaseMigrations1746429752612'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."idx_products_attributes"`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "breadcrumbs" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "breadcrumbs"`);
        await queryRunner.query(`CREATE INDEX "idx_products_attributes" ON "products" ("attributes") `);
    }

}
