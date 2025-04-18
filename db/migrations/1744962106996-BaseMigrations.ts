import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1744962106996 implements MigrationInterface {
    name = 'BaseMigrations1744962106996'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tag" ADD "articles" integer array NOT NULL DEFAULT '{}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tag" DROP COLUMN "articles"`);
    }

}
