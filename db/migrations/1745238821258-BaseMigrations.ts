import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1745238821258 implements MigrationInterface {
    name = 'BaseMigrations1745238821258'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" ADD "seo_keywords" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" DROP COLUMN "seo_keywords"`);
    }

}
