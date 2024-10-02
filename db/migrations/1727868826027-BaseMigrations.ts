import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1727868826027 implements MigrationInterface {
    name = 'BaseMigrations1727868826027'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_attributes" ADD "merge_keys" character varying array NOT NULL DEFAULT ARRAY[]::varchar[]`);
        await queryRunner.query(`ALTER TABLE "product_attributes" ADD "multiple_values" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_attributes" DROP COLUMN "multiple_values"`);
        await queryRunner.query(`ALTER TABLE "product_attributes" DROP COLUMN "merge_keys"`);
    }

}
