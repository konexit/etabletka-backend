import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1739289151772 implements MigrationInterface {
    name = 'BaseMigrations1739289151772'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "categories" SET DEFAULT ARRAY[]::int[]`);
        await queryRunner.query(`ALTER TABLE "product_attributes" ALTER COLUMN "merge_keys" SET DEFAULT ARRAY[]::varchar[]`);
        await queryRunner.query(`ALTER TABLE "order_statuses_descriptions" DROP COLUMN "trade_status_id"`);
        await queryRunner.query(`ALTER TABLE "order_statuses_descriptions" ADD "trade_status_id" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_statuses_descriptions" DROP COLUMN "trade_status_id"`);
        await queryRunner.query(`ALTER TABLE "order_statuses_descriptions" ADD "trade_status_id" character varying`);
        await queryRunner.query(`ALTER TABLE "product_attributes" ALTER COLUMN "merge_keys" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "categories" SET DEFAULT ARRAY[]`);
    }

}
