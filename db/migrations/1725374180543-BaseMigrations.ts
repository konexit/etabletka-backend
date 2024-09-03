import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1725374180543 implements MigrationInterface {
    name = 'BaseMigrations1725374180543'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "brands" ADD "seo_keywords" json`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "brands" DROP COLUMN "seo_keywords"`);
    }

}
