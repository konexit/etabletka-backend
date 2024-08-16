import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1723794756433 implements MigrationInterface {
    name = 'BaseMigrations1723794756433'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "seo_keywords"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "seo_text"`);
        await queryRunner.query(`ALTER TABLE "brands" DROP COLUMN "seo_text"`);
        await queryRunner.query(`ALTER TABLE "brands" DROP COLUMN "seo_keywords"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "seo_keywords"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "seo_title_auto"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "seo_h1_auto"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "seo_keywords_auto"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "seo_description_auto"`);
        await queryRunner.query(`ALTER TABLE "blog_posts" DROP COLUMN "seo_text"`);
        await queryRunner.query(`ALTER TABLE "blog_posts" DROP COLUMN "seo_keywords"`);
        await queryRunner.query(`ALTER TABLE "blog_categories" DROP COLUMN "seo_text"`);
        await queryRunner.query(`ALTER TABLE "blog_categories" DROP COLUMN "seo_keywords"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blog_categories" ADD "seo_keywords" json`);
        await queryRunner.query(`ALTER TABLE "blog_categories" ADD "seo_text" json`);
        await queryRunner.query(`ALTER TABLE "blog_posts" ADD "seo_keywords" json`);
        await queryRunner.query(`ALTER TABLE "blog_posts" ADD "seo_text" json`);
        await queryRunner.query(`ALTER TABLE "products" ADD "seo_description_auto" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "products" ADD "seo_keywords_auto" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "products" ADD "seo_h1_auto" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "products" ADD "seo_title_auto" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "products" ADD "seo_keywords" json`);
        await queryRunner.query(`ALTER TABLE "brands" ADD "seo_keywords" json`);
        await queryRunner.query(`ALTER TABLE "brands" ADD "seo_text" json`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "seo_text" json`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "seo_keywords" json`);
    }

}
