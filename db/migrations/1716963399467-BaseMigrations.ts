import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1716963399467 implements MigrationInterface {
    name = 'BaseMigrations1716963399467'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "banners" ADD "published" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "banners" DROP COLUMN "published"`);
    }

}
