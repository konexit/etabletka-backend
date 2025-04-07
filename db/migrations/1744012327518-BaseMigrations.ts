import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1744012327518 implements MigrationInterface {
    name = 'BaseMigrations1744012327518'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_profile" ALTER COLUMN "favorite_products" SET DEFAULT '{}'::integer[]`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "categories" SET DEFAULT '{}'::integer[]`);
        await queryRunner.query(`ALTER TABLE "product_attributes" ALTER COLUMN "merge_keys" SET DEFAULT '{}'::integer[]`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_attributes" ALTER COLUMN "merge_keys" SET DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "categories" SET DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "user_profile" ALTER COLUMN "favorite_products" SET DEFAULT '{}'`);
    }

}
