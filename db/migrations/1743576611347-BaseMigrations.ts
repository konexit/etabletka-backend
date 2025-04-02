import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1743576611347 implements MigrationInterface {
    name = 'BaseMigrations1743576611347'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_profile" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user_profile" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user_profile" DROP COLUMN "date_of_birth"`);
        await queryRunner.query(`ALTER TABLE "user_profile" ADD "date_of_birth" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user_profile" ALTER COLUMN "favorite_products" SET DEFAULT '{}'::integer[]`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "categories" SET DEFAULT '{}'::integer[]`);
        await queryRunner.query(`ALTER TABLE "product_attributes" ALTER COLUMN "merge_keys" SET DEFAULT '{}'::integer[]`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_attributes" ALTER COLUMN "merge_keys" SET DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "categories" SET DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "user_profile" ALTER COLUMN "favorite_products" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "user_profile" DROP COLUMN "date_of_birth"`);
        await queryRunner.query(`ALTER TABLE "user_profile" ADD "date_of_birth" character varying(30)`);
        await queryRunner.query(`ALTER TABLE "user_profile" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "user_profile" DROP COLUMN "created_at"`);
    }

}
