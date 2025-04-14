import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1744613194888 implements MigrationInterface {
    name = 'BaseMigrations1744613194888'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "cdn_data"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "cdn_instruction"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "cdn_data"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "alt"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "cdn_icon"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "images" character varying array NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "user_profile" ALTER COLUMN "favorite_products" SET DEFAULT '{}'::integer[]`);
        await queryRunner.query(`ALTER TABLE "user_profile" ALTER COLUMN "comments" SET DEFAULT '{}'::integer[]`);
        await queryRunner.query(`ALTER TABLE "user_profile" ALTER COLUMN "answers" SET DEFAULT '{}'::integer[]`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "seo_h1"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "seo_h1" jsonb`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "name" jsonb`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "name_short"`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "name_short" jsonb`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "description" jsonb`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "seo_h1"`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "seo_h1" jsonb`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "seo_title"`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "seo_title" jsonb`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "seo_description"`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "seo_description" jsonb`);
        await queryRunner.query(`ALTER TABLE "product_attributes" ALTER COLUMN "merge_keys" SET DEFAULT '{}'::integer[]`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_attributes" ALTER COLUMN "merge_keys" SET DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "seo_description"`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "seo_description" json`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "seo_title"`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "seo_title" json`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "seo_h1"`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "seo_h1" json`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "description" json`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "name_short"`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "name_short" json`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "name" json`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "seo_h1"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "seo_h1" json`);
        await queryRunner.query(`ALTER TABLE "user_profile" ALTER COLUMN "answers" SET DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "user_profile" ALTER COLUMN "comments" SET DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "user_profile" ALTER COLUMN "favorite_products" SET DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "images"`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "cdn_icon" character varying`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "alt" json`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "cdn_data" json`);
        await queryRunner.query(`ALTER TABLE "products" ADD "cdn_instruction" jsonb`);
        await queryRunner.query(`ALTER TABLE "products" ADD "cdn_data" jsonb`);
    }

}
