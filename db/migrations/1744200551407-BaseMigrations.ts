import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1744200551407 implements MigrationInterface {
    name = 'BaseMigrations1744200551407'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "blog_comments_likes"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "blog_comments"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "blog_posts_blog_categories"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "blog_posts"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "blog_categories"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "product_comments_likes"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "product_comments"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "cdn_media"`);
        await queryRunner.query(`CREATE TYPE "public"."comments_type_enum" AS ENUM('article', 'product')`);
        await queryRunner.query(`CREATE TABLE "comments" ("id" SERIAL NOT NULL, "modelId" integer NOT NULL, "type" "public"."comments_type_enum" NOT NULL, "userId" integer NOT NULL, "parent_id" integer, "comment" text NOT NULL, "is_approved" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "articles" ("id" SERIAL NOT NULL, "author_id" integer NOT NULL, "censor_id" integer NOT NULL, "published_at" date NOT NULL, "title" jsonb NOT NULL, "slug" character varying NOT NULL, "excerpt" jsonb, "content" jsonb, "alt" jsonb, "cdn_data" jsonb, "seo_h1" jsonb, "seo_title" jsonb, "seo_description" jsonb, "published" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_1123ff6815c5b8fec0ba9fec370" UNIQUE ("slug"), CONSTRAINT "PK_0a6e2c450d83e0b6052c2793334" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tag" ("id" SERIAL NOT NULL, "title" jsonb NOT NULL, "slug" character varying NOT NULL, "seo_h1" jsonb, "seo_title" jsonb, "seo_description" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_3413aed3ecde54f832c4f44f045" UNIQUE ("slug"), CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "articles_tags" ("articlesId" integer NOT NULL, "tagId" integer NOT NULL, CONSTRAINT "PK_6997a1ae50457dd22f4956a07d9" PRIMARY KEY ("articlesId", "tagId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_58ca47808973d214ea64c71893" ON "articles_tags" ("articlesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_b54b6a9b430c2fabecd25d3732" ON "articles_tags" ("tagId") `);
        await queryRunner.query(`ALTER TABLE "user_profile" ALTER COLUMN "favorite_products" SET DEFAULT '{}'::integer[]`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "categories" SET DEFAULT '{}'::integer[]`);
        await queryRunner.query(`ALTER TABLE "product_attributes" ALTER COLUMN "merge_keys" SET DEFAULT '{}'::integer[]`);
        await queryRunner.query(`ALTER TABLE "articles" ADD CONSTRAINT "FK_6515da4dff8db423ce4eb841490" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "articles" ADD CONSTRAINT "FK_1b1747b9c1faf1f80543faa7223" FOREIGN KEY ("censor_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "articles_tags" ADD CONSTRAINT "FK_58ca47808973d214ea64c718936" FOREIGN KEY ("articlesId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "articles_tags" ADD CONSTRAINT "FK_b54b6a9b430c2fabecd25d3732e" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles_tags" DROP CONSTRAINT "FK_b54b6a9b430c2fabecd25d3732e"`);
        await queryRunner.query(`ALTER TABLE "articles_tags" DROP CONSTRAINT "FK_58ca47808973d214ea64c718936"`);
        await queryRunner.query(`ALTER TABLE "articles" DROP CONSTRAINT "FK_1b1747b9c1faf1f80543faa7223"`);
        await queryRunner.query(`ALTER TABLE "articles" DROP CONSTRAINT "FK_6515da4dff8db423ce4eb841490"`);
        await queryRunner.query(`ALTER TABLE "product_attributes" ALTER COLUMN "merge_keys" SET DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "categories" SET DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "user_profile" ALTER COLUMN "favorite_products" SET DEFAULT '{}'`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b54b6a9b430c2fabecd25d3732"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_58ca47808973d214ea64c71893"`);
        await queryRunner.query(`DROP TABLE "articles_tags"`);
        await queryRunner.query(`DROP TABLE "tag"`);
        await queryRunner.query(`DROP TABLE "articles"`);
        await queryRunner.query(`DROP TABLE "comments"`);
        await queryRunner.query(`DROP TYPE "public"."comments_type_enum"`);
    }

}
