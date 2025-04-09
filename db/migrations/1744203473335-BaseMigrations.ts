import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1744203473335 implements MigrationInterface {
    name = 'BaseMigrations1744203473335'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_profile" ADD "comments" integer array NOT NULL DEFAULT '{}'::integer[]`);
        await queryRunner.query(`ALTER TABLE "user_profile" ADD "answers" integer array NOT NULL DEFAULT '{}'::integer[]`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_profile" DROP COLUMN "answers"`);
        await queryRunner.query(`ALTER TABLE "user_profile" DROP COLUMN "comments"`);
    }
}
