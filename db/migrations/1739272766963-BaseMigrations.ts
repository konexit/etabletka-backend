import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1739272766963 implements MigrationInterface {
    name = 'BaseMigrations1739272766963'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_statuses" ADD "trade_status_id" integer`);
        await queryRunner.query(`ALTER TABLE "order_statuses" ADD CONSTRAINT "UQ_62aefceabc2de091c60f318832b" UNIQUE ("trade_status_id")`);
        await queryRunner.query(`ALTER TABLE "order_statuses" ADD "order_type_id" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "categories" SET DEFAULT ARRAY[]::int[]`);
        await queryRunner.query(`ALTER TABLE "product_attributes" ALTER COLUMN "merge_keys" SET DEFAULT ARRAY[]::varchar[]`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_attributes" ALTER COLUMN "merge_keys" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "categories" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "order_statuses" DROP COLUMN "order_type_id"`);
        await queryRunner.query(`ALTER TABLE "order_statuses" DROP CONSTRAINT "UQ_62aefceabc2de091c60f318832b"`);
        await queryRunner.query(`ALTER TABLE "order_statuses" DROP COLUMN "trade_status_id"`);
    }

}
