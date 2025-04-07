import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1744012197854 implements MigrationInterface {
    name = 'BaseMigrations1744012197854'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "blog_posts_blog_categories" ("blogCategoriesId" integer NOT NULL, "blogPostsId" integer NOT NULL, CONSTRAINT "PK_804944629c8683825712b8b6771" PRIMARY KEY ("blogCategoriesId", "blogPostsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_68be711a5228f603c47bbb001f" ON "blog_posts_blog_categories" ("blogCategoriesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c056bd2ab7b732acff9bfbd93d" ON "blog_posts_blog_categories" ("blogPostsId") `);
        await queryRunner.query(`ALTER TABLE "user_profile" ALTER COLUMN "favorite_products" SET DEFAULT '{}'::integer[]`);
        await queryRunner.query(`ALTER TABLE "blog_categories" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "blog_categories" ADD "title" jsonb NOT NULL`);
        await queryRunner.query(`ALTER TABLE "blog_categories" DROP COLUMN "seo_h1"`);
        await queryRunner.query(`ALTER TABLE "blog_categories" ADD "seo_h1" jsonb`);
        await queryRunner.query(`ALTER TABLE "blog_categories" DROP COLUMN "seo_title"`);
        await queryRunner.query(`ALTER TABLE "blog_categories" ADD "seo_title" jsonb`);
        await queryRunner.query(`ALTER TABLE "blog_categories" DROP COLUMN "seo_description"`);
        await queryRunner.query(`ALTER TABLE "blog_categories" ADD "seo_description" jsonb`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "categories" SET DEFAULT '{}'::integer[]`);
        await queryRunner.query(`ALTER TABLE "product_attributes" ALTER COLUMN "merge_keys" SET DEFAULT '{}'::integer[]`);
        await queryRunner.query(`ALTER TABLE "blog_posts_blog_categories" ADD CONSTRAINT "FK_68be711a5228f603c47bbb001f2" FOREIGN KEY ("blogCategoriesId") REFERENCES "blog_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "blog_posts_blog_categories" ADD CONSTRAINT "FK_c056bd2ab7b732acff9bfbd93de" FOREIGN KEY ("blogPostsId") REFERENCES "blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blog_posts_blog_categories" DROP CONSTRAINT "FK_c056bd2ab7b732acff9bfbd93de"`);
        await queryRunner.query(`ALTER TABLE "blog_posts_blog_categories" DROP CONSTRAINT "FK_68be711a5228f603c47bbb001f2"`);
        await queryRunner.query(`ALTER TABLE "product_attributes" ALTER COLUMN "merge_keys" SET DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "categories" SET DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "blog_categories" DROP COLUMN "seo_description"`);
        await queryRunner.query(`ALTER TABLE "blog_categories" ADD "seo_description" json`);
        await queryRunner.query(`ALTER TABLE "blog_categories" DROP COLUMN "seo_title"`);
        await queryRunner.query(`ALTER TABLE "blog_categories" ADD "seo_title" json`);
        await queryRunner.query(`ALTER TABLE "blog_categories" DROP COLUMN "seo_h1"`);
        await queryRunner.query(`ALTER TABLE "blog_categories" ADD "seo_h1" json`);
        await queryRunner.query(`ALTER TABLE "blog_categories" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "blog_categories" ADD "title" json NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_profile" ALTER COLUMN "favorite_products" SET DEFAULT '{}'`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c056bd2ab7b732acff9bfbd93d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_68be711a5228f603c47bbb001f"`);
        await queryRunner.query(`DROP TABLE "blog_posts_blog_categories"`);
    }

}
