import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1728035962904 implements MigrationInterface {
    name = 'BaseMigrations1728035962904'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_attributes" DROP COLUMN "filter"`);
        await queryRunner.query(`ALTER TABLE "product_attributes" DROP COLUMN "filter_ui"`);
        await queryRunner.query(`CREATE TYPE "public"."product_attributes_type_source_enum" AS ENUM('headder', 'attributes')`);
        await queryRunner.query(`ALTER TABLE "product_attributes" ADD "type_source" "public"."product_attributes_type_source_enum" NOT NULL DEFAULT 'attributes'`);
        await queryRunner.query(`ALTER TABLE "product_attributes" ADD "search_engine" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "product_attributes" ADD "ui" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "product_attributes" ALTER COLUMN "merge_keys" SET DEFAULT ARRAY[]::varchar[]`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_attributes" ALTER COLUMN "merge_keys" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "product_attributes" DROP COLUMN "ui"`);
        await queryRunner.query(`ALTER TABLE "product_attributes" DROP COLUMN "search_engine"`);
        await queryRunner.query(`ALTER TABLE "product_attributes" DROP COLUMN "type_source"`);
        await queryRunner.query(`DROP TYPE "public"."product_attributes_type_source_enum"`);
        await queryRunner.query(`ALTER TABLE "product_attributes" ADD "filter_ui" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "product_attributes" ADD "filter" boolean NOT NULL DEFAULT false`);
    }

}
