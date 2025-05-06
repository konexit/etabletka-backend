import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1746526923198 implements MigrationInterface {
    name = 'BaseMigrations1746526923198'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "breadcrumbs"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" ADD "breadcrumbs" jsonb`);
    }

}
