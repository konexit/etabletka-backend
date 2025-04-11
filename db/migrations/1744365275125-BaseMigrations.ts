import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1744365275125 implements MigrationInterface {
    name = 'BaseMigrations1744365275125'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" ADD "anonymous" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "anonymous"`);
    }
}
