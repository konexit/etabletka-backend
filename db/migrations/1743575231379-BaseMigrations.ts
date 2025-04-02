import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1743575231379 implements MigrationInterface {
    name = 'BaseMigrations1743575231379'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_profile" ADD "middle_name" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "user_profile" DROP COLUMN "avatar"`);
        await queryRunner.query(`ALTER TABLE "user_profile" ADD "avatar" character varying`);
        await queryRunner.query(`ALTER TABLE "user_profile" ALTER COLUMN "favorite_products" SET DEFAULT ARRAY[]::int[]`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "categories" SET DEFAULT ARRAY[]::int[]`);
        await queryRunner.query(`ALTER TABLE "product_attributes" ALTER COLUMN "merge_keys" SET DEFAULT ARRAY[]::varchar[]`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_attributes" ALTER COLUMN "merge_keys" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "categories" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "user_profile" ALTER COLUMN "favorite_products" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "user_profile" DROP COLUMN "avatar"`);
        await queryRunner.query(`ALTER TABLE "user_profile" ADD "avatar" jsonb`);
        await queryRunner.query(`ALTER TABLE "user_profile" DROP COLUMN "middle_name"`);
    }

}
