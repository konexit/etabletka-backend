import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1744637894748 implements MigrationInterface {
    name = 'BaseMigrations1744637894748'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "seo_keywords" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "seo_keywords"`);
    }

}
