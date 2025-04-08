import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1744094863519 implements MigrationInterface {
    name = 'BaseMigrations1744094863519'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_profile" ADD "user_id" integer`);
        await queryRunner.query(`ALTER TABLE "user_profile" ADD CONSTRAINT "UQ_eee360f3bff24af1b6890765201" UNIQUE ("user_id")`);
        await queryRunner.query(`ALTER TABLE "user_profile" ALTER COLUMN "favorite_products" SET DEFAULT '{}'::integer[]`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "categories" SET DEFAULT '{}'::integer[]`);
        await queryRunner.query(`ALTER TABLE "product_attributes" ALTER COLUMN "merge_keys" SET DEFAULT '{}'::integer[]`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_attributes" ALTER COLUMN "merge_keys" SET DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "categories" SET DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "user_profile" ALTER COLUMN "favorite_products" SET DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "user_profile" DROP CONSTRAINT "UQ_eee360f3bff24af1b6890765201"`);
        await queryRunner.query(`ALTER TABLE "user_profile" DROP COLUMN "user_id"`);
    }

}
