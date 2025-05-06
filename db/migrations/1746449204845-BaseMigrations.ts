import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1746449204845 implements MigrationInterface {
    name = 'BaseMigrations1746449204845'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "path"`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "path" integer array NOT NULL DEFAULT '{}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "path"`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "path" character varying`);
    }

}
