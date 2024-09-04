import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1725374550385 implements MigrationInterface {
    name = 'BaseMigrations1725374550385'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "brands" ADD "seo_text" json`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "brands" DROP COLUMN "seo_text"`);
    }

}
