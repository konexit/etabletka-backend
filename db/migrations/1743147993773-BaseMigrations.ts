import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1743147993773 implements MigrationInterface {
    name = 'BaseMigrations1743147993773'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" RENAME COLUMN "city_id" TO "katottg_id"`);
        await queryRunner.query(`ALTER TABLE "order_carts" RENAME COLUMN "city_id" TO "katottg_id"`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "categories" SET DEFAULT ARRAY[]::int[]`);
        await queryRunner.query(`ALTER TABLE "product_attributes" ALTER COLUMN "merge_keys" SET DEFAULT ARRAY[]::varchar[]`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_attributes" ALTER COLUMN "merge_keys" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "categories" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "order_carts" RENAME COLUMN "katottg_id" TO "city_id"`);
        await queryRunner.query(`ALTER TABLE "orders" RENAME COLUMN "katottg_id" TO "city_id"`);
    }

}
