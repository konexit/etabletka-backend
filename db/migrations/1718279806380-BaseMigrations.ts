import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1718279806380 implements MigrationInterface {
    name = 'BaseMigrations1718279806380'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blog_comments" DROP CONSTRAINT "FK_52742190272d7097205aac2aae0"`);
        await queryRunner.query(`ALTER TABLE "product_badges" DROP CONSTRAINT "FK_d16f96a2e1b441f133b9522bdcb"`);
        await queryRunner.query(`ALTER TABLE "product_badges" DROP CONSTRAINT "FK_3c5f099898dc401fb5cf4a071ef"`);
        await queryRunner.query(`ALTER TABLE "product_discounts" DROP CONSTRAINT "FK_68e668b0341f0276ebcc2a91506"`);
        await queryRunner.query(`ALTER TABLE "product_discounts" DROP CONSTRAINT "FK_4d3f74396271c6bee81a1a547a0"`);
        await queryRunner.query(`ALTER TABLE "products_categories" DROP CONSTRAINT "FK_f2c76a4306a82c696d620f81f08"`);
        await queryRunner.query(`ALTER TABLE "products_categories" DROP CONSTRAINT "FK_19fe0fe8c2fcf1cbe1a80f639f1"`);
        await queryRunner.query(`ALTER TABLE "blog_posts_categories" DROP CONSTRAINT "FK_a2b76678db1607f0ea83149ea66"`);
        await queryRunner.query(`ALTER TABLE "blog_posts_categories" DROP CONSTRAINT "FK_b6eab84b4c3e20428c8c00782d4"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "user_id" integer`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_96aac72f1574b88752e9fb00089" UNIQUE ("user_id")`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_9adb63f24f86528856373f0ab9a"`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "instruction_uk" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "UQ_3c0af0455cd2d82ad2bbc8c9679" UNIQUE ("instruction_uk")`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "instruction_ru" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "UQ_3af8c8a9b60dbd078827f9991c1" UNIQUE ("instruction_ru")`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "instruction_en" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "UQ_69b65e4b1956d70a7cf7e4b379f" UNIQUE ("instruction_en")`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "UQ_9adb63f24f86528856373f0ab9a" UNIQUE ("product_type_id")`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "blog_comments_id_seq" OWNED BY "blog_comments"."id"`);
        await queryRunner.query(`ALTER TABLE "blog_comments" ALTER COLUMN "id" SET DEFAULT nextval('"blog_comments_id_seq"')`);
        await queryRunner.query(`ALTER TABLE "blog_comments" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "blog_comments" ADD CONSTRAINT "UQ_c34a2a0bf1dcc3687871de1ff1e" UNIQUE ("user_id")`);
        await queryRunner.query(`ALTER TABLE "blog_posts" ADD CONSTRAINT "UQ_c3fc4a3a656aad74331acfcf2a9" UNIQUE ("author_id")`);
        await queryRunner.query(`ALTER TABLE "blog_posts" ADD CONSTRAINT "UQ_09cc83bdfa111d9031aa0c64c64" UNIQUE ("censor_id")`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_96aac72f1574b88752e9fb00089" FOREIGN KEY ("user_id") REFERENCES "user_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_9adb63f24f86528856373f0ab9a" FOREIGN KEY ("product_type_id") REFERENCES "product_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blog_comments" ADD CONSTRAINT "FK_c34a2a0bf1dcc3687871de1ff1e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blog_comments" ADD CONSTRAINT "FK_4e0b8959256b08ceb3d001f616b" FOREIGN KEY ("post_id") REFERENCES "blog_posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blog_posts" ADD CONSTRAINT "FK_c3fc4a3a656aad74331acfcf2a9" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blog_posts" ADD CONSTRAINT "FK_09cc83bdfa111d9031aa0c64c64" FOREIGN KEY ("censor_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products_categories" ADD CONSTRAINT "FK_19fe0fe8c2fcf1cbe1a80f639f1" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "products_categories" ADD CONSTRAINT "FK_f2c76a4306a82c696d620f81f08" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_badges" ADD CONSTRAINT "FK_3c5f099898dc401fb5cf4a071ef" FOREIGN KEY ("badge_id") REFERENCES "badges"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "product_badges" ADD CONSTRAINT "FK_d16f96a2e1b441f133b9522bdcb" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_discounts" ADD CONSTRAINT "FK_4d3f74396271c6bee81a1a547a0" FOREIGN KEY ("discount_id") REFERENCES "discounts"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "product_discounts" ADD CONSTRAINT "FK_68e668b0341f0276ebcc2a91506" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blog_posts_categories" ADD CONSTRAINT "FK_b6eab84b4c3e20428c8c00782d4" FOREIGN KEY ("category_id") REFERENCES "blog_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "blog_posts_categories" ADD CONSTRAINT "FK_a2b76678db1607f0ea83149ea66" FOREIGN KEY ("post_id") REFERENCES "blog_posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blog_posts_categories" DROP CONSTRAINT "FK_a2b76678db1607f0ea83149ea66"`);
        await queryRunner.query(`ALTER TABLE "blog_posts_categories" DROP CONSTRAINT "FK_b6eab84b4c3e20428c8c00782d4"`);
        await queryRunner.query(`ALTER TABLE "product_discounts" DROP CONSTRAINT "FK_68e668b0341f0276ebcc2a91506"`);
        await queryRunner.query(`ALTER TABLE "product_discounts" DROP CONSTRAINT "FK_4d3f74396271c6bee81a1a547a0"`);
        await queryRunner.query(`ALTER TABLE "product_badges" DROP CONSTRAINT "FK_d16f96a2e1b441f133b9522bdcb"`);
        await queryRunner.query(`ALTER TABLE "product_badges" DROP CONSTRAINT "FK_3c5f099898dc401fb5cf4a071ef"`);
        await queryRunner.query(`ALTER TABLE "products_categories" DROP CONSTRAINT "FK_f2c76a4306a82c696d620f81f08"`);
        await queryRunner.query(`ALTER TABLE "products_categories" DROP CONSTRAINT "FK_19fe0fe8c2fcf1cbe1a80f639f1"`);
        await queryRunner.query(`ALTER TABLE "blog_posts" DROP CONSTRAINT "FK_09cc83bdfa111d9031aa0c64c64"`);
        await queryRunner.query(`ALTER TABLE "blog_posts" DROP CONSTRAINT "FK_c3fc4a3a656aad74331acfcf2a9"`);
        await queryRunner.query(`ALTER TABLE "blog_comments" DROP CONSTRAINT "FK_4e0b8959256b08ceb3d001f616b"`);
        await queryRunner.query(`ALTER TABLE "blog_comments" DROP CONSTRAINT "FK_c34a2a0bf1dcc3687871de1ff1e"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_9adb63f24f86528856373f0ab9a"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_96aac72f1574b88752e9fb00089"`);
        await queryRunner.query(`ALTER TABLE "blog_posts" DROP CONSTRAINT "UQ_09cc83bdfa111d9031aa0c64c64"`);
        await queryRunner.query(`ALTER TABLE "blog_posts" DROP CONSTRAINT "UQ_c3fc4a3a656aad74331acfcf2a9"`);
        await queryRunner.query(`ALTER TABLE "blog_comments" DROP CONSTRAINT "UQ_c34a2a0bf1dcc3687871de1ff1e"`);
        await queryRunner.query(`ALTER TABLE "blog_comments" ALTER COLUMN "id" SET DEFAULT nextval('"blog-comments_id_seq"')`);
        await queryRunner.query(`ALTER TABLE "blog_comments" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "blog_comments_id_seq"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "UQ_9adb63f24f86528856373f0ab9a"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "UQ_69b65e4b1956d70a7cf7e4b379f"`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "instruction_en" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "UQ_3af8c8a9b60dbd078827f9991c1"`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "instruction_ru" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "UQ_3c0af0455cd2d82ad2bbc8c9679"`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "instruction_uk" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_9adb63f24f86528856373f0ab9a" FOREIGN KEY ("product_type_id") REFERENCES "product_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_96aac72f1574b88752e9fb00089"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "blog_posts_categories" ADD CONSTRAINT "FK_b6eab84b4c3e20428c8c00782d4" FOREIGN KEY ("category_id") REFERENCES "blog_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "blog_posts_categories" ADD CONSTRAINT "FK_a2b76678db1607f0ea83149ea66" FOREIGN KEY ("post_id") REFERENCES "blog_posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products_categories" ADD CONSTRAINT "FK_19fe0fe8c2fcf1cbe1a80f639f1" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "products_categories" ADD CONSTRAINT "FK_f2c76a4306a82c696d620f81f08" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_discounts" ADD CONSTRAINT "FK_4d3f74396271c6bee81a1a547a0" FOREIGN KEY ("discount_id") REFERENCES "discounts"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "product_discounts" ADD CONSTRAINT "FK_68e668b0341f0276ebcc2a91506" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_badges" ADD CONSTRAINT "FK_3c5f099898dc401fb5cf4a071ef" FOREIGN KEY ("badge_id") REFERENCES "badges"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "product_badges" ADD CONSTRAINT "FK_d16f96a2e1b441f133b9522bdcb" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blog_comments" ADD CONSTRAINT "FK_52742190272d7097205aac2aae0" FOREIGN KEY ("post_id") REFERENCES "blog_posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
