import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1722926526356 implements MigrationInterface {
    name = 'BaseMigrations1722926526356'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "site_options" ADD "json" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "site_options" DROP COLUMN "json"`);
    }

}
