import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1745240560901 implements MigrationInterface {
    name = 'BaseMigrations1745240560901'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tags" ADD "seo_keywords" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tags" DROP COLUMN "seo_keywords"`);
    }

}
