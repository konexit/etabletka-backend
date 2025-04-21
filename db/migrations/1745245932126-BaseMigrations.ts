import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1745245932126 implements MigrationInterface {
    name = 'BaseMigrations1745245932126'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" DROP COLUMN "cdn_data"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" ADD "cdn_data" jsonb`);
    }

}
