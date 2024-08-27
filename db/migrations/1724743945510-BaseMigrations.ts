import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1724743945510 implements MigrationInterface {
    name = 'BaseMigrations1724743945510'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "product_comments" ("id" SERIAL NOT NULL, "product_id" integer NOT NULL, "user_id" integer NOT NULL, "parent_id" integer, "comment" text NOT NULL, "is_approved" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_310f5a0059db779ef661d04b31" UNIQUE ("user_id"), CONSTRAINT "PK_89c843deed630c2b3d226d04a1b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "seo_keywords"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "seo_text"`);
        await queryRunner.query(`ALTER TABLE "brands" DROP COLUMN "seo_keywords"`);
        await queryRunner.query(`ALTER TABLE "brands" DROP COLUMN "seo_text"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "seo_h1_auto"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "seo_title_auto"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "seo_description_auto"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "seo_keywords"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "seo_keywords_auto"`);
        await queryRunner.query(`ALTER TABLE "blog_categories" DROP COLUMN "seo_text"`);
        await queryRunner.query(`ALTER TABLE "blog_categories" DROP COLUMN "seo_keywords"`);
        await queryRunner.query(`ALTER TABLE "blog_posts" DROP COLUMN "seo_text"`);
        await queryRunner.query(`ALTER TABLE "blog_posts" DROP COLUMN "seo_keywords"`);
        await queryRunner.query(`ALTER TABLE "product_comments" ADD CONSTRAINT "FK_310f5a0059db779ef661d04b31b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_comments" ADD CONSTRAINT "FK_e31d9690c86f4e08410446bbf16" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_comments" DROP CONSTRAINT "FK_e31d9690c86f4e08410446bbf16"`);
        await queryRunner.query(`ALTER TABLE "product_comments" DROP CONSTRAINT "FK_310f5a0059db779ef661d04b31b"`);
        await queryRunner.query(`ALTER TABLE "blog_posts" ADD "seo_keywords" json`);
        await queryRunner.query(`ALTER TABLE "blog_posts" ADD "seo_text" json`);
        await queryRunner.query(`ALTER TABLE "blog_categories" ADD "seo_keywords" json`);
        await queryRunner.query(`ALTER TABLE "blog_categories" ADD "seo_text" json`);
        await queryRunner.query(`ALTER TABLE "products" ADD "seo_keywords_auto" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "products" ADD "seo_keywords" json`);
        await queryRunner.query(`ALTER TABLE "products" ADD "seo_description_auto" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "products" ADD "seo_title_auto" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "products" ADD "seo_h1_auto" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "brands" ADD "seo_text" json`);
        await queryRunner.query(`ALTER TABLE "brands" ADD "seo_keywords" json`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "seo_text" json`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "seo_keywords" json`);
        await queryRunner.query(`DROP TABLE "product_comments"`);
    }

}
