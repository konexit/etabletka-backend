import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1742811968633 implements MigrationInterface {
    name = 'BaseMigrations1742811968633'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" ADD "country_id" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "stores" ADD "region_id" integer`);
        await queryRunner.query(`ALTER TABLE "stores" ADD "district_id" integer`);
        await queryRunner.query(`ALTER TABLE "stores" ADD "city_id" integer`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "categories" SET DEFAULT ARRAY[]::int[]`);
        await queryRunner.query(`ALTER TABLE "product_attributes" ALTER COLUMN "merge_keys" SET DEFAULT ARRAY[]::varchar[]`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_attributes" ALTER COLUMN "merge_keys" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "categories" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "city_id"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "district_id"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "region_id"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "country_id"`);
    }

}
